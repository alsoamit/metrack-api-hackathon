import APIResponse from "../helpers/APIResponse";
import tokenService from "../services/token-service";
import userService from "../services/user-service";

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
    return APIResponse.successResponseWithData(res, { auth: true, user });
  }

  async logout(req, res) {
    const { metrackRefreshCookie } = req.cookies;
    await tokenService.removeToken(metrackRefreshCookie);

    res.clearCookie("metrackRefreshCookie");
    res.clearCookie("metrackAccessCookie");
    return APIResponse.successResponseWithData(res, {
      user: null,
      auth: false,
    });
  }

  async registerUser(req, res) {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
      return APIResponse.unauthorizedResponse(res, "all fields are required");
    }

    try {
      let user = await userService.findUser({ email });
      if (user) {
        return APIResponse.validationErrorWithData(res, "user already exists");
      }
      user = await userService.createUser({
        username,
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

      return APIResponse.successResponseWithData(res, "account created", user);
    } catch (err) {
      return APIResponse.errorResponse(res);
    }
  }

  async loginUser(req, res) {
    const { email, password } = req.body;

    if (!password || !email) {
      return APIResponse.validationErrorWithData(res, "empty fields");
    }

    try {
      let user = await userService.findUser({ email });

      if (!user) {
        return APIResponse.validationErrorWithData(res, "user not found");
      }

      if (user.password !== password) {
        return APIResponse.validationErrorWithData(
          res,
          "wrong credentials",
          req.body
        );
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

      return APIResponse.successResponseWithData(res, {
        msg: "Login Successfull",
        user,
      });
    } catch (err) {
      console.log(err);
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
