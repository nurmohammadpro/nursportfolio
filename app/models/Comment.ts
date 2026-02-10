import mongoose, { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
  {
    postSlug: { type: String, required: true, index: true },
    postId: { type: String, required: true, index: true },
    authorName: { type: String, required: true },
    authorEmail: { type: String, required: true },
    authorUrl: { type: String },
    content: { type: String, required: true },
    parentId: { type: String, default: null }, // For nested replies
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "spam"],
      default: "pending",
    },
    ipAddress: { type: String },
    userAgent: { type: String },
    likeCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Index for efficient queries
CommentSchema.index({ postSlug: 1, status: 1 });
CommentSchema.index({ postId: 1, parentId: 1 });

const Comment = models.Comment || model("Comment", CommentSchema);
export default Comment;
