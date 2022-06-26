import { Types, Schema, model } from "mongoose";

const CourseSchema = new Schema(
  {
    name: { type: String },
    students: [{ type: Types.ObjectId, ref: 'User' }],
    channel: { type: String },
    description: { type: String },
    category: { type: String },
    domain: { type: String },
    aboutChannel: { type: String },
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
  },
  { timestamps: true }
);

export default model("Course", CourseSchema, "courses");
