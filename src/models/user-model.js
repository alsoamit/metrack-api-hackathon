import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    avatar: { type: String },
    courseEnrolled: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
    password: { type: String, required: true },
    name: {
      required: true,
      type: String,
      default: "User",
    },
    verified: {
      type: Boolean,
      default: false,
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
