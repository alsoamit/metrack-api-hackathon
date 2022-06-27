import ChannelModel from '../models/channel-model';

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
        const channel = await ChannelModel.find(filter);
        return channel;
    }

    async createChannel(data) {
        const channel = await ChannelModel.create(data);
        return channel;
    }

    async deleteChannel(id) {
        const channel = await ChannelModel.findByIdAndDelete(id);
        return channel;
    }

    async updateChannel(id, data) {
        return await ChannelModel.findByIdAndUpdate(id, data, { new: true });
    }
}

export default new ChannelService();
