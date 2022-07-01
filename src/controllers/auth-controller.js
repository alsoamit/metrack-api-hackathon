import ejs from "ejs";
import mongoose from "mongoose";
import APIResponse from "../helpers/APIResponse";
import magicTokenService from "../services/magic-token-service";
import tokenService from "../services/token-service";
import userService from "../services/user-service";
import mailService from "../services/mail-service";
import hashService from "../services/hash-service";

function setTokensInCookie(res, token) {
    // put it in cookie
    res.cookie("metrackAccessCookie", token.accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
    });

    res.cookie("metrackRefreshCookie", token.refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
    });
}

class AuthController {
    async refresh(req, res) {
        // getrefresh token from header
        const { metrackRefreshCookie: refreshTokenFromCookie } = req.cookies;

        // check if token is valid
        let userData;
        try {
            userData = await tokenService.verifyRefreshToken(
                refreshTokenFromCookie
            );
        } catch (err) {
            console.log(err);
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
            console.log(err);
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
            role: user.role,
        });

        // update refresh token
        try {
            tokenService.updateRefreshToken(userData._id, refreshToken);
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }

        setTokensInCookie(res, { accessToken, refreshToken });
        user.password = "";
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

        try {
            let user = await userService.findUser({ email });

            const hashedPassword = await hashService.encrypt(password);

            if (user) {
                return APIResponse.validationError(res, "user already exists");
            }

            user = await userService.createUser({
                name,
                email,
                password: hashedPassword,
            });

            // generate new token
            const { accessToken, refreshToken } = tokenService.generateToken({
                _id: user._id,
                role: user.role,
            });

            // save refresh token in db
            const savedToken = tokenService.storeRefreshToken(
                user._id,
                refreshToken
            );
            if (!savedToken) {
                return APIResponse.errorResponse(res);
            }

            setTokensInCookie(res, { accessToken, refreshToken });

            user.password = "";
            return APIResponse.successResponseWithData(
                res,
                user,
                "account created"
            );
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }

    async adminLogin(req, res) {
        const { email, password } = req.body;
        try {
            const user = await userService.findUser({ email });

            if (!user) {
                return APIResponse.validationError(res, "user not found");
            }
            const match = await hashService.compare(password, user.password);
            if (!match) {
                return APIResponse.validationError(res, "wrong credentials");
            }
            if (user.role < 2) {
                return APIResponse.unauthorizedResponse(res, "invalid admin");
            }
            // generate new token
            const { accessToken, refreshToken } = tokenService.generateToken({
                _id: user._id,
                role: user.role,
            });

            // save refresh token in db
            const savedToken = tokenService.storeRefreshToken(
                user._id,
                refreshToken
            );
            if (!savedToken) {
                return APIResponse.errorResponse(res);
            }

            setTokensInCookie(res, { accessToken, refreshToken });
            user.password = "";
            return APIResponse.successResponseWithData(res, user, "logged in");
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }

    async loginUser(req, res) {
        const { email, password } = req.body;
        try {
            const user = await userService.findUser({ email });

            if (!user) {
                return APIResponse.validationError(res, "user not found");
            }

            const match = await hashService.compare(password, user.password);
            if (!match) {
                return APIResponse.validationError(res, "wrong credentials");
            }

            // generate new token
            const { accessToken, refreshToken } = tokenService.generateToken({
                _id: user._id,
                role: user.role,
            });

            // save refresh token in db
            const savedToken = tokenService.storeRefreshToken(
                user._id,
                refreshToken
            );
            if (!savedToken) {
                return APIResponse.errorResponse(res);
            }

            setTokensInCookie(res, { accessToken, refreshToken });
            user.password = "";
            return APIResponse.successResponseWithData(res, user, "logged in");
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }

    async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;
            const user = await userService.findUser({ email });
            if (!user) {
                return APIResponse.notFoundResponse(res, "user not found");
            }
            const { resetToken, token } = await magicTokenService.generate(
                user._id
            );
            if (!resetToken) {
                return APIResponse.errorResponse(res, "internal server error");
            }
            const link = `${process.env.CLIENT_URL}/auth/reset-password?userId=${user._id}&token=${resetToken}`;
            // send the email template
            const data = await ejs.renderFile(
                `${__dirname}/../mails/reset-password.ejs`,
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

            return APIResponse.successResponseWithData(
                res,
                user.email,
                "email sent"
            );
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }

    async magicTokenValidation(req, res) {
        try {
            const { userId, token } = req.body;

            const passwordResetToken = await magicTokenService.findOne({
                userId: mongoose.Types.ObjectId(userId),
            });

            if (!passwordResetToken) {
                return APIResponse.validationError(
                    res,
                    "invalid or expired token"
                );
            }

            const isValid = await hashService.compare(
                token,
                passwordResetToken.token
            );

            if (!isValid) {
                return APIResponse.validationError(
                    res,
                    "invalid or expired token 2"
                );
            }

            return APIResponse.successResponse(res, "valid token");
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }

    async resetPassword(req, res) {
        try {
            const { userId, token, password } = req.body;
            const passwordResetToken = await magicTokenService.findOne({
                userId: mongoose.Types.ObjectId(userId),
            });
            if (!passwordResetToken) {
                return APIResponse.validationError(
                    res,
                    "invalid or expired token"
                );
            }
            const isValid = await hashService.compare(
                token,
                passwordResetToken.token
            );
            if (!isValid) {
                return APIResponse.validationError(
                    res,
                    "invalid or expired token 2"
                );
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
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }

    async updatePassword(req, res) {
        try {
            const { oldPassword, newPassword } = req.body;
            let { user } = req;
            user = await userService.findUser({ _id: req.user._id });
            if (!user) {
                return APIResponse.validationError(res, "user not found");
            }
            const match = await hashService.compare(oldPassword, user.password);
            if (!match) {
                return APIResponse.validationError(res, "wrong credentials");
            }
            const hash = await hashService.encrypt(newPassword);
            user.password = hash;
            await user.save();
            await mailService.send(
                user.email,
                "Password changed",
                `Password changed for ${user.email}`
            );
            return APIResponse.successResponse(res, "password changed");
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }

    async updateAvatar(req, res) {
        const { id, url } = req.body;

        try {
            const user = await userService.findUser({ _id: id });

            if (!user) {
                return APIResponse.validationError(res, "user not found");
            }
            user.avatar = url;
            await user.save();
            return APIResponse.successResponseWithData(
                res,
                user,
                "updated successfully"
            );
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }
}

export default new AuthController();
