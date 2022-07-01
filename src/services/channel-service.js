import ChannelModel from "../models/channel-model";

class ChannelService {
    async findChannel(filter) {
        try {
            const channel = await ChannelModel.findOne(filter);
            return channel;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async getAllChannels(filter) {
        return ChannelModel.find(filter);
    }

    async createChannel(data) {
        return ChannelModel.create(data);
    }

    async deleteChannel(id) {
        return ChannelModel.findByIdAndDelete(id);
    }

    async updateChannel(id, data) {
        return ChannelModel.findByIdAndUpdate(id, data, { new: true });
    }
}

export default new ChannelService();
