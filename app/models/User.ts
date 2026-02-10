import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    // Changed to optional: Google OAuth users won't have a password
    password: { type: String, required: false, select: false }, 
    image: { type: String },
    role: {
      type: String,
      enum: ["ADMIN", "USER"], // Matches your makeAdmin script
      default: "USER",
    },
    status: { type: String, default: "active" },
    // Changed to optional: Google doesn't provide phone numbers by default
    phone: { type: String, required: false }, 
    location: { type: String },
    bio: { type: String },
    emailVerified: { type: Date, default: null },
  },
  { timestamps: true },
);

// Important for Next.js 15 HMR to prevent model re-registration errors
const User = models.User || model("User", UserSchema);
export default User;