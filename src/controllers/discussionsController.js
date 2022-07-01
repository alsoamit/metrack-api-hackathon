import APIResponse from "../helpers/APIResponse";
import discussionService from "../services/discussion-service";
import messageService from "../services/message-service";

class DiscussionController {
  async getDiscussionById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return APIResponse.validationError(res, "invalid id field");
      }
      const discussion = await discussionService.getOne({ _id: id });
      if (!discussion) {
        return APIResponse.notFoundResponse(res, "discussion not available");
      }
      if (discussion.banned) {
        return APIResponse.notFoundResponse(res, "this discussion is banned");
      }
      let chat = await messageService.getMany({ discussionId: discussion._id });
      console.log({ chat });
      if (!chat) {
        chat = [];
      }
      return APIResponse.successResponseWithData(
        res,
        { ...discussion, chat },
        "successful"
      );
    } catch (err) {
      console.log(err);
      return APIResponse.errorResponse(res);
    }
  }

  async updateDiscussion(req, res) {
    try {
      const { id } = req.params;
      const discussion = await discussionService.find({ _id: id });
      if (!discussion) {
        return APIResponse.notFoundResponse(res, "discussion not available");
      }
      if (discussion.banned) {
        return APIResponse.notFoundResponse(res, "this discussion is banned");
      }
      return APIResponse.successResponseWithData(res, discussion);
    } catch (err) {
      console.log(err);
      return APIResponse.errorResponse(res);
    }
  }

  async banDiscussion(req, res) {
    try {
      const { id } = req.params;
      const discussion = await discussionService.find({ _id: id });
      if (!discussion) {
        return APIResponse.notFoundResponse(res, "discussion not available");
      }
      if (discussion.banned) {
        return APIResponse.notFoundResponse(res, "already banned");
      }
      discussion.banned = true;
      discussion.save();
      return APIResponse.successResponseWithData(res, discussion);
    } catch (err) {
      console.log(err);
      return APIResponse.errorResponse(res);
    }
  }

  async setDiscussionReadOnly(req, res) {
    try {
      const { id } = req.params;
      const discussion = await discussionService.find({ _id: id });
      if (!discussion) {
        return APIResponse.notFoundResponse(res, "discussion not available");
      }
      if (discussion.readOnly) {
        return APIResponse.validationError(res, "already set to readonly");
      }
      discussion.readOnly = true;
      discussion.save();
      return APIResponse.successResponseWithData(res, discussion);
    } catch (err) {
      console.log(err);
      return APIResponse.errorResponse(res);
    }
  }

  async setDiscussionReadWrite(req, res) {
    try {
      const { id } = req.params;
      const discussion = await discussionService.find({ _id: id });
      if (!discussion) {
        return APIResponse.notFoundResponse(res, "discussion not available");
      }
      if (!discussion.readOnly) {
        return APIResponse.validationError(
          res,
          "already set to read write mode"
        );
      }
      discussion.readOnly = false;
      discussion.save();
      return APIResponse.successResponseWithData(res, discussion);
    } catch (err) {
      console.log(err);
      return APIResponse.errorResponse(res);
    }
  }
}

export default new DiscussionController();
