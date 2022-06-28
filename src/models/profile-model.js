import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    avatar: { type: String },
    hashnode: { type: String },
    github: { type: String },
    linkedin: { type: String },
    about: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Profile", profileSchema, "profiles");
