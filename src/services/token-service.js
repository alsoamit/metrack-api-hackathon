import jwt from "jsonwebtoken";
import refreshModel from "../models/refresh-model";

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_ACCESS_TOKEN_SECRET,
            {
                expiresIn: "6h",
            }
        );
        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_TOKEN_SECRET,
            {
                expiresIn: "1y",
            }
        );

        return { accessToken, refreshToken };
    }

    async storeRefreshToken(userId, token) {
        try {
            return await refreshModel.create({
                token,
                userId,
            });
        } catch (err) {
            return err;
        }
    }

    async verifyAccessToken(token) {
        return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    }

    async verifyRefreshToken(token) {
        return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
    }

    async findRefreshToken(userId, refreshToken) {
        return refreshModel.findOne({ userId, token: refreshToken });
    }

    async updateRefreshToken(userId, refreshToken) {
        return refreshModel.updateOne({ userId }, { token: refreshToken });
    }

    async removeToken(refreshToken) {
        return refreshModel.deleteOne({ token: refreshToken });
    }
}

export default new TokenService();
