import APIResponse from "../helpers/APIResponse";
import userService from "../services/user-service";

class AdminController {
  async getUsers(req, res) {
    try {
      let { filter } = req.body;
      if (!filter) {
        filter = {};
      }
      let users = await userService.getAllUser(filter);
      return APIResponse.successResponseWithData(res, users, "found users");
    } catch (err) {
      return APIResponse.errorResponse(err);
    }
  }
}

export default new AdminController();
