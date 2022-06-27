import APIResponse from "../helpers/APIResponse";

async function verifyAdmin(req, res, next) {
  try {
    const { role } = req.user;
    if (role === undefined) {
      return APIResponse.unauthorizedResponse(res, "user not found");
    }
    if (role >= 2) {
      return next();
    }
    return APIResponse.unauthorizedResponse(res, "invalid admin");
  } catch (err) {
    console.log(err);
    return APIResponse.unauthorizedResponse(res);
  }
}

export default verifyAdmin;
