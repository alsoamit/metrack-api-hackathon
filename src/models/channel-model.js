import { Schema, model } from "mongoose";

const ChannelSchema = new Schema(
    {
        channelName: { type: String },
        aboutChannel: { type: String },
        channelImage: { type: String },
    },
    { timestamps: true }
);

export default model("Channel", ChannelSchema, "channels");
