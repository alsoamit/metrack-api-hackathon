import APIResponse from "../helpers/APIResponse";
import { io } from "../server";
import discussionService from "../services/discussion-service";
import messageService from "../services/message-service";

class MessageController {
    async addMessage(req, res) {
        try {
            const { user } = req;
            const { message, discussionId, sender } = req.body;

            if (!user) {
                return APIResponse.notFoundResponse(res, "invalid user");
            }

            const discussion = await discussionService.getOneWithoutPopulation({
                _id: discussionId,
            });

            if (!discussion) {
                return APIResponse.validationError(res, "invalid discussion");
            }

            const savedData = await messageService.create({
                message,
                discussionId: discussion._id,
                user: user._id,
                avatar: user.avatar,
            });

            io.to(discussionId).emit("update:message", {
                ...savedData.toObject(),
                user: sender,
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

    async addReply(req, res) {
        try {
            const { user } = req;
            const { discussionId, reply, messageId, sender } = req.body;
            if (!discussionId || !reply || !messageId) {
                return APIResponse.validationError(res);
            }

            const discussion = await discussionService.getOneWithoutPopulation({
                _id: discussionId,
            });

            if (!discussion) {
                return APIResponse.validationError(res, "invalid discussion");
            }

            const message = await messageService.getOne({ _id: messageId });
            console.log(user, discussionId, reply, messageId, message);

            if (!message) {
                return APIResponse.notFoundResponse(res, "message not found");
            }

            const savedData = await messageService.create({
                message: reply,
                discussionId,
                user: user._id,
                isReply: true,
                avatar: user.avatar,
            });

            if (!savedData) {
                return APIResponse.errorResponse(res, "failed to add reply");
            }

            message.replies.push(savedData);
            message.save();

            io.to(discussionId).emit("update:reply", {
                id: message._id,
                data: {
                    ...savedData.toObject(),
                    user: sender,
                },
            });

            return APIResponse.successResponseWithData(res, message);
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }
}

export default new MessageController();
