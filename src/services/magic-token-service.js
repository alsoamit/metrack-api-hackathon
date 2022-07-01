import crypto from "crypto";
import Token from "../models/token-model";
import hashService from "./hash-service";

class MagicTokenService {
    async generate(userId) {
        let token = await Token.findOne({ userId });
        if (token) await token.deleteOne();
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await hashService.encrypt(resetToken);

        token = await new Token({
            userId,
            token: hash,
        }).save();
        return { resetToken, token };
    }

    async findOne(filter) {
        return Token.findOne(filter);
    }

    async remove(filter) {
        return Token.deleteOne(filter);
    }
}

export default new MagicTokenService();
