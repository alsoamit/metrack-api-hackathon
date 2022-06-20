import { Schema, model } from "mongoose";

const tokenSchema = new Schema(
  {
    token: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    role: { type: Number, default: 0, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("MagicToken", tokenSchema, "magictokens");
