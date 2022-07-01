import MessageModel from "../models/message-model";

class MessageService {
    async getMany(filter) {
        try {
            return await MessageModel.find(filter)
                .where({ isReply: false })
                .limit(100)
                .sort({ createdAt: -1 })
                .populate("user", "name avatar")
                .populate({
                    path: "replies",
                    populate: { path: "user", select: "name avatar" },
                });
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getOne(filter) {
        return MessageModel.findOne(filter);
    }

    async create(data) {
        return MessageModel.create(data);
    }

    async update(filter, data) {
        return MessageModel.updateOne(filter, data, { new: true });
    }

    async deleteOne(filter) {
        return MessageModel.deleteOne(filter);
    }
}

export default new MessageService();
