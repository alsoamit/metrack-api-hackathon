import ejs from "ejs";
import mongoose from "mongoose";
import APIResponse from "../helpers/APIResponse";
import magicTokenService from "../services/magic-token-service";
import tokenService from "../services/token-service";
import userService from "../services/user-service";
import mailService from "../services/mail-service";
import hashService from "../services/hash-service";

class AuthController {
  async refresh(req, res) {
    // getrefresh token from header
    const { metrackRefreshCookie: refreshTokenFromCookie } = req.cookies;

    // check if token is valid
    let userData;
    try {
      userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
    } catch (err) {
      return APIResponse.unauthorizedResponse(res, "invalid token");
    }

    // check the token is in the db
    try {
      const token = await tokenService.findRefreshToken(
        userData._id,
        refreshTokenFromCookie
      );
      if (!token) {
        return APIResponse.unauthorizedResponse(res, "invalid token");
      }
    } catch (err) {
      return APIResponse.errorResponse(res);
    }

    // check valid user
    const user = await userService.findUser({ _id: userData._id });
    if (!user) {
      return APIResponse.notFoundResponse(res, "user not found");
    }

    // generate new token
    const { accessToken, refreshToken } = tokenService.generateToken({
      _id: userData._id,
    });

    // update refresh token
    try {
      tokenService.updateRefreshToken(userData._id, refreshToken);
    } catch (err) {
      return APIResponse.errorResponse(res);
    }

    setTokensInCookie(res, { accessToken, refreshToken });

    // response
    return APIResponse.successResponseWithData(res, user);
  }

  async logout(req, res) {
    const { metrackRefreshCookie } = req.cookies;
    await tokenService.removeToken(metrackRefreshCookie);

    res.clearCookie("metrackRefreshCookie");
    res.clearCookie("metrackAccessCookie");
    return APIResponse.successResponse(res, "logged out");
  }

  async registerUser(req, res) {
    const { name, email, password } = req.body;

    if (!name || !password || !email) {
      return APIResponse.unauthorizedResponse(res, "all fields are required");
    }

    try {
      let user = await userService.findUser({ email });
      if (user) {
        return APIResponse.validationErrorWithData(res, "user already exists");
      }
      user = await userService.createUser({
        name,
        email,
        password,
      });

      // generate new token
      const { accessToken, refreshToken } = tokenService.generateToken({
        _id: user._id,
      });

      // save refresh token in db
      const savedToken = tokenService.storeRefreshToken(user._id, refreshToken);
      if (!savedToken) {
        return APIResponse.errorResponse(res);
      }

      setTokensInCookie(res, { accessToken, refreshToken });

      return APIResponse.successResponseWithData(res, user, "account created");
    } catch (err) {
      return APIResponse.errorResponse(res);
    }
  }

  async loginUser(req, res) {
    const { email, password } = req.body;

    if (!password || !email) {
      return APIResponse.validationError(res, "empty fields");
    }

    try {
      let user = await userService.findUser({ email });

      if (!user) {
        return APIResponse.validationError(res, "user not found");
      }

      if (user.password !== password) {
        return APIResponse.validationError(res, "wrong credentials");
      }
      // generate new token
      const { accessToken, refreshToken } = tokenService.generateToken({
        _id: user._id,
      });

      // save refresh token in db
      const savedToken = tokenService.storeRefreshToken(user._id, refreshToken);
      if (!savedToken) {
        return APIResponse.errorResponse(res);
      }

      setTokensInCookie(res, { accessToken, refreshToken });

      return APIResponse.successResponseWithData(res, user, "logged in");
    } catch (err) {
      console.log(err);
      return APIResponse.errorResponse(res);
    }
  }

  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return APIResponse.validationErrorWithData(
          res,
          req.body,
          "empty fields"
        );
      }
      const user = await userService.findUser({ email });
      if (!user) {
        return APIResponse.notFoundResponse(res, "user not found");
      }
      const { resetToken, token } = await magicTokenService.generate(user._id);
      if (!resetToken) {
        return APIResponse.errorResponse(res, "internal server error");
      }
      const link = `${process.env.CLIENT_URL}/auth/reset-password/${user._id}/${resetToken}`;
      // send the email template
      const data = await ejs.renderFile(
        __dirname + "/../mails/reset-password.ejs",
        { email: user.email, name: user.name, link },
        { async: true }
      );

      const emailSent = await mailService.send(
        user.email,
        "Password reset",
        data
      );

      if (!emailSent) {
        await magicTokenService.remove(token);
        return APIResponse.errorResponse(res);
      }

      return APIResponse.successResponseWithData(res, user.email, "email sent");
    } catch (err) {
      console.log(err);
      return APIResponse.errorResponse(res);
    }
  }

  async resetPassword(req, res) {
    try {
      const { userId, token, password } = req.body;
      let passwordResetToken = await magicTokenService.findOne({
        userId: mongoose.Types.ObjectId(userId),
      });
      if (!passwordResetToken) {
        return APIResponse.validationError(res, "invalid or expired token");
      }
      const isValid = await hashService.compare(
        token,
        passwordResetToken.token
      );
      if (!isValid) {
        return APIResponse.validationError(res, "invalid or expired token 2");
      }
      const hash = await hashService.encrypt(password);
      const user = await userService.findUser({ _id: userId });
      user.password = hash;
      await user.save();
      await passwordResetToken.deleteOne();
      await mailService.send(
        user.email,
        "Password changed",
        `Password changed for ${user.email}`
      );
      return APIResponse.successResponse(res, "password changed");
    } catch (err) {
      return APIResponse.errorResponse(res);
    }
  }
}

const setTokensInCookie = (res, token) => {
  // put it in cookie
  res.cookie("metrackAccessCookie", token.accessToken, {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  });

  res.cookie("metrackRefreshCookie", token.refreshToken, {
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  });
};

export default new AuthController();
