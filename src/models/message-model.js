import { Types, Schema, model, mongo } from "mongoose";

const MessageSchema = new Schema(
  {
    message: { type: String, required: true },
    from: { type: Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

export default model("Message", MessageSchema, "messages");
