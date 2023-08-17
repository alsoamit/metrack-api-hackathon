import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: { type: String, required: true, unique: true },
    name: { type: String },
    avatar: { type: String },
    github: { type: String },
    linkedin: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    website: { type: String },
    headline: { type: String },
    about: { type: String },
    cover: { type: String },
    followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    coursesEnrolled: [{ type: mongoose.Types.ObjectId, ref: "Course" }],
    projectsCreated: [{ type: mongoose.Types.ObjectId, ref: "Project" }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Profile", profileSchema, "profiles");
