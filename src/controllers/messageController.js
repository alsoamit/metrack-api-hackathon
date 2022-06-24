import APIResponse from "../helpers/APIResponse";
import { io } from "../server";
import discussionService from "../services/discussion-service";
import messageService from "../services/message-service";
import userService from "../services/user-service";

class MessageController {
  async addMessage(req, res) {
    try {
      const user = req.user;
      let { message, discussionId, replyOf } = req.body;
      console.log(discussionId, "did");
      if (!user) {
        return APIResponse.notFoundResponse(res, "invalid user");
      }

      let discussion = await discussionService.getOneWithoutPopulation({
        _id: discussionId,
      });

      if (!discussion) {
        return APIResponse.validationError(res, "invalid discussion");
      }

      let savedData = await messageService.create({
        message,
        discussionId: discussion._id,
        user: user._id,
        replyOf: replyOf._id,
      });

      io.to(discussionId).emit("update_state", {
        ...savedData.toObject(),
        user: { _id: user._id },
        replyOf: replyOf,
      });

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
}

export default new MessageController();
