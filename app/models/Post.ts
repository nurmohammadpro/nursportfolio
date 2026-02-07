import mongoose, { Schema, model, models } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    imageUrl: { type: String },
    isPublished: { type: Boolean, default: false },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Post = models.Post || model("Post", PostSchema);
export default Post;
