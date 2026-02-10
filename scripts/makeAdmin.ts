// Run this with: npx tsx scripts/makeAdmin.ts
import mongoose from "mongoose";
import User from "../app/models/User";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const makeAdmin = async (email: string) => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("Error: MONGODB_URI is not defined in .env.local");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Atlas...");

    // Find the user by email (case-insensitive check)
    const userEmail = email.toLowerCase().trim();
    
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      { 
        $set: { 
          role: "ADMIN",
          status: "active" 
        } 
      },
      { new: true, runValidators: false } // runValidators: false helps bypass required fields for existing records
    );

    if (updatedUser) {
      console.log("-----------------------------------------");
      console.log(`SUCCESS: ${updatedUser.email} is now an ${updatedUser.role}`);
      console.log(`User ID: ${updatedUser._id}`);
      console.log("-----------------------------------------");
    } else {
      console.log("-----------------------------------------");
      console.log(`ERROR: User with email [${userEmail}] not found.`);
      console.log("Action: Please log in to the LIVE site first to create the account.");
      console.log("-----------------------------------------");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Critical Error during update:", error);
  }
};

makeAdmin("nurprodev@gmail.com");