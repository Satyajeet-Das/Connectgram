import mongoose, { Schema } from "mongoose";
import { IComment } from "../types/models";

const CommentSchema: Schema<IComment> = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<IComment>("Comment", CommentSchema);
