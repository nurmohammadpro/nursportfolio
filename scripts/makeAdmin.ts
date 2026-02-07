// Run this with: npx ts-node scripts/makeAdmin.ts
import mongoose from "mongoose";
import User from "../app/models/User";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const makeAdmin = async (email: string) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB...");

    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { $set: { role: "ADMIN" } },
      { new: true },
    );

    if (updatedUser) {
      console.log(`Success! ${email} is now an ${updatedUser.role}`);
    } else {
      console.log(
        "User not found. Make sure you have logged in via Google first.",
      );
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

makeAdmin("nurprodev@gmail.com");
