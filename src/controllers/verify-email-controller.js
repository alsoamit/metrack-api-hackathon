import ejs from "ejs";
import mongoose from "mongoose";
import APIResponse from "../helpers/APIResponse";
import mailService from "../services/mail-service";
import userService from "../services/user-service";
import magicTokenService from "../services/magic-token-service";
import hashService from "../services/hash-service";

class VerifyEmailController {
  async sendLink(req, res) {
    try {
      const user = await userService.findUser({ _id: req?.user?._id });
      if (!user) {
        return APIResponse.notFoundResponse(res, "user not found");
      }
      if (user?.verified) {
        return APIResponse.validationErrorWithData(
          res,
          "user already verified"
        );
      }
      const { resetToken, token } = await magicTokenService.generate(user._id);
      if (!resetToken) {
        return APIResponse.errorResponse(res, "internal server error");
      }
      const link = `${process.env.CLIENT_URL}/auth/verify-email/?userId=${user._id}&token=${resetToken}`;
      // send the email template
      const data = await ejs.renderFile(
        `${__dirname  }/../mails/verify-email.ejs`,
        { email: user.email, name: user.name, link },
        { async: true }
      );

      const emailSent = await mailService.send(
        user.email,
        "Email Verification",
        data
      );

      if (!emailSent) {
        await magicTokenService.remove(token);
        return APIResponse.errorResponse(res);
      }

      return APIResponse.successResponseWithData(res, user.email, "email sent");
    } catch (err) {
      console.log(err);
      return APIResponse.errorResponse(res, "error in verification");
    }
  }

  async verify(req, res) {
    try {
      const { userId, token } = req.body;

      const emailVerificationToken = await magicTokenService.findOne({
        userId: mongoose.Types.ObjectId(userId),
      });

      if (!emailVerificationToken) {
        return APIResponse.validationError(res, "invalid or expired token");
      }

      const isValid = await hashService.compare(
        token,
        emailVerificationToken.token
      );

      if (!isValid) {
        return APIResponse.validationError(res, "invalid or expired token 2");
      }

      const user = await userService.findUser({ _id: userId });
      user.verified = true;
      await user.save();

      await emailVerificationToken.deleteOne();

      await mailService.send(
        user.email,
        "Email verified",
        `Your email ${user.email} is verified.`
      );
      return APIResponse.successResponse(res, "Email Verifed")
    } catch (err) {
      console.log(err);
      return APIResponse.errorResponse(res);
    }
  }
}

export default new VerifyEmailController();
