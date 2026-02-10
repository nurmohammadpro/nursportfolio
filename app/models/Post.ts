import mongoose, { Schema, model, models } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    authorBio: { type: String },
    authorAvatar: { type: String },
    imageUrl: { type: String },
    featuredImage: { type: String },
    category: { type: String, default: "general" },
    tags: [{ type: String }],
    readingTime: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    seoTitle: { type: String },
    seoDescription: { type: String },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Post = models.Post || model("Post", PostSchema);
export default Post;
