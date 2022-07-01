import { Types, Schema, model } from "mongoose";

const DiscussionModel = new Schema(
    {
        courseId: {
            type: Types.ObjectId,
            required: true,
            ref: "Course",
        },
        banned: {
            type: Boolean,
            default: false,
        },
        readOnly: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default model("Discussion", DiscussionModel, "discussions");
