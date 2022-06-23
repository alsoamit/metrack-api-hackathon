import MessageModel from "../models/message-model";

class MessageService {
  async getAll(filter) {
    try {
      const users = await MessageModel.find((filter = null)).populate(
        "from",
        "name"
      );

      return users;
    } catch (err) {
      return err;
    }
  }

  async create(data) {
    const user = await MessageModel.create(data);
    return user;
  }

  async update(filter, data) {
    return await MessageModel.update(filter, data, { new: true });
  }

  async deleteOne(filter) {
    return await MessageModel.deleteOne(filter);
  }
}

export default new MessageService();
