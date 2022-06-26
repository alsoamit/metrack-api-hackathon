import { Types, Schema, model, mongo } from "mongoose";

const MessageSchema = new Schema(
  {
    message: { type: String, required: true },
    discussionId: { type: Types.ObjectId, required: true, ref: "Discussion" },
    user: { type: Types.ObjectId, required: true, ref: "User" },
    replies: [{ type: Types.ObjectId, ref: "Message" }],
    isReply: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default model("Message", MessageSchema, "messages");
