import mongoose, { Schema } from "mongoose";
import { IPost } from "../types/models";

const PostSchema: Schema<IPost> = new Schema(
  {
    photo: [{ type: Buffer }],
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
