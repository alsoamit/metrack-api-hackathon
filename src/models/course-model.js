import { Types, Schema, model } from "mongoose";

const CourseSchema = new Schema(
  {
    name: { type: String },
    students: [{ type: String }],
    channel: { type: String },
    description: { type: String },
    thumbnail: { type: String },
    channelImage: { type: String },
    respect: { type: Number, default: 0 },
    video: { type: String },
    tags: [{ type: String }],
    level: { type: String },
    isPublished: { type: Boolean, default: false },
    discussionId: {
      type: Types.ObjectId,
      ref: "Discussion",
    },
    projects: [
      {
        projectName: { type: String },
        projectImage: { type: String },
        projectUrl: { type: String },
        projectCode: { type: String },
        studentName: { type: String },
        studentImage: { type: String },
        appreciation: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export default model("Course", CourseSchema, "courses");
