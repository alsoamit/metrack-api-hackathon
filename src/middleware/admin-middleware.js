import APIResponse from "../helpers/APIResponse";
import tokenService from "../services/token-service";

async function authenticate(req, res, next) {
    try {
        const { metrackAccessCookie } = req.cookies;

        if (!metrackAccessCookie) {
            return APIResponse.validationErrorWithData(res, "invalid token", null);
        }

        const userData = await tokenService.verifyAccessToken(metrackAccessCookie);

        if (!userData) {
            throw new Error();
        }

        req.user = userData;
        next();
    } catch (err) {
        console.log(err);
        return APIResponse.unauthorizedResponse(res, "invalid token");
    }
}

export default authenticate;
