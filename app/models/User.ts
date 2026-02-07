import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    image: { type: String },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    status: { type: String, default: "active" },
    phone: { type: String, required: true },
    location: { type: String },
    bio: { type: String },
    emailVerified: { type: Date, default: null },
  },
  { timestamps: true },
);

const User = models.User || model("User", UserSchema);
export default User;
