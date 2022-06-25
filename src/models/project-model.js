import { Types, Schema, model } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
    },
    githubUrl: String,
    webUrl: String,
    tags: [String],
    appreciation: {
      type: Number,
      default: 0,
    },
    feedbacks: [
      {
        message: { type: String, required: true },
        user: { type: Types.ObjectId, required: true, ref: "User" },
      },
      { timestamps: true },
    ],
  },
  { timestamps: true }
);

export default model("Project", ProjectSchema, "projects");
