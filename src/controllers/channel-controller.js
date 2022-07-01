import APIResponse from "../helpers/APIResponse";
import ChannelService from '../services/channel-service'

class ChannelController {
    async addChannel(req, res) {
        const {
            channelName,
            channelImage,
            aboutChannel
        } = req.body;

        if (
            !channelName ||
            !channelImage ||
            !aboutChannel
        ) {
            return APIResponse.unauthorizedResponse(res, "All Fields are required");
        }

        try {
            let channel = await ChannelService.findChannel({ channelName });
            if (channel) {
                return APIResponse.validationError(res, "channel already exists");
            }

            channel = await ChannelService.createChannel({
                channelName,
                channelImage,
                aboutChannel
            });

            await channel.save();
            return APIResponse.successResponseWithData(res, channel, "channel created");
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }

    async getAllChannels(req, res) {
        try {
            const channels = await ChannelService.getAllChannels();
            return APIResponse.successResponseWithData(res, channels);
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }

    async getChannelById(req, res) {
        const { id } = req.params;

        try {
            const channel = await ChannelService.findChannel({ _id: id });

            if (!channel) {
                return APIResponse.notFoundResponse(res);
            }

            return APIResponse.successResponseWithData(res, channel);
        } catch (err) {
            console.log(err);
            return APIResponse.errorResponse(res);
        }
    }
}

export default new ChannelController();
