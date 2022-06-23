import APIResponse from "../helpers/APIResponse";
import { io } from "../server";
import messageService from "../services/message-service";
import userService from "../services/user-service";

class MessageController {
  async addMessage(req, res) {
    try {
      const user = req.user;
      let { message } = req.body;

      if (!user) {
        return APIResponse.notFoundResponse(res, "invalid user");
      }

      let savedData = await messageService.create({
        message,
        from: user._id,
      });

      io.emit("message", savedData);

      return APIResponse.successResponseWithData(
        res,
        savedData,
        "message saved"
      );
    } catch (err) {
      console.log(err);
      return APIResponse.errorResponse(res);
    }
  }

  async getMessages(req, res) {
    try {
      let messages = await messageService.getAll();
      if (!messages) {
        return APIResponse.notFoundResponse(res, "no message found");
      }
      return APIResponse.successResponseWithData(res, messages);
    } catch (err) {
      console.log(err);
      return APIResponse.errorResponse(res);
    }
  }
}

export default new MessageController();
