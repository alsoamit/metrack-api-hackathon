import DiscussionModel from "../models/discussion-model";

class DiscussionService {
    async getAll(filter) {
        try {
            const discussion = await DiscussionModel.find(filter)
                .sort("date")
                .limit(100)
                .populate("chat");
            return discussion;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getOne(filter) {
        try {
            return await DiscussionModel.findOne(filter).lean();
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getOneWithoutPopulation(filter) {
        console.log(filter);
        try {
            const discussion = await DiscussionModel.findOne(filter);
            console.log(discussion, "from service");
            return discussion;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async create(data) {
        const user = await DiscussionModel.create(data);
        return user;
    }

    async update(filter, data) {
        return DiscussionModel.updateOne(filter, data, { new: true });
    }

    async deleteOne(filter) {
        return DiscussionModel.deleteOne(filter);
    }
}

export default new DiscussionService();
