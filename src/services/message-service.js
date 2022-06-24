import MessageModel from "../models/message-model";

class MessageService {
  async getMany(filter) {
    try {
      return await MessageModel.find(filter)
        .limit(100)
        .sort({ createdAt: -1 })
        .populate("user", "name")
        .populate({
          path: "replyOf",
          populate: { path: "user", select: "name" },
        });
    } catch (err) {
      return err;
    }
  }

  async create(data) {
    return await MessageModel.create(data);
  }

  async update(filter, data) {
    return await MessageModel.updateOne(filter, data, { new: true });
  }

  async deleteOne(filter) {
    return await MessageModel.deleteOne(filter);
  }
}

export default new MessageService();
