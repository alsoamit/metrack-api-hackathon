import APIResponse from "../helpers/APIResponse";
import userService from "../services/user-service";

class AdminController {
    async getUsers(req, res) {
        try {
            let { filter } = req.body;
            if (!filter) {
                filter = {};
            }
            const users = await userService.getAllUser(filter);
            return APIResponse.successResponseWithData(
                res,
                users,
                "found users"
            );
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res, err);
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return APIResponse.validationError(res, "id is required");
            }
            const user = await userService.deleteOne({ _id: id });
            if (!user) {
                return APIResponse.notFoundResponse(res, "user not found");
            }
            return APIResponse.successResponseWithData(
                res,
                { id },
                "user delete"
            );
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res, err);
        }
    }
}

export default new AdminController();
