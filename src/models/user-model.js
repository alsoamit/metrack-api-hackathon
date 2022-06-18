import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String },
    password: { type: String, required: true },
    name: {
      required: true,
      type: String,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema, "users");
