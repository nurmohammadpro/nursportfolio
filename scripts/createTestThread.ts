// Run this with: npx tsx scripts/createTestThread.ts
import mongoose from "mongoose";
import EmailThread from "../app/models/EmailThread";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const createTestThread = async (clientEmail: string, clientName: string) => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("Error: MONGODB_URI is not defined in .env.local");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB...");

    // Check if thread already exists
    const existing = await EmailThread.findOne({ clientEmail: clientEmail.toLowerCase() });
    if (existing) {
      console.log("Thread already exists for:", clientEmail);
      console.log("Title:", existing.title);
      await mongoose.disconnect();
      return;
    }

    // Create test thread
    const newThread = await EmailThread.create({
      clientEmail: clientEmail.toLowerCase(),
      clientName: clientName,
      title: "Test Project",
      description: "Test email thread for inbound email testing",
      fromEmail: "nurprodev@gmail.com",
      status: "inbox",
      unread: false,
      messages: [{
        text: "This is a test thread created for inbound email testing.",
        sender: "nurprodev@gmail.com",
        type: "outbound",
        createdAt: new Date(),
      }],
    });

    console.log("-----------------------------------------");
    console.log("✅ Test thread created!");
    console.log(`Client Email: ${newThread.clientEmail}`);
    console.log(`Title: ${newThread.title}`);
    console.log(`ID: ${newThread._id}`);
    console.log("-----------------------------------------");
    console.log("\nNow send an email from this address to your Resend inbound email:");
    console.log(`From: ${clientEmail}`);
    console.log("To: [your-resend-inbound-address]");
    console.log("\nThe incoming email should be saved to this thread!");

    await mongoose.disconnect();
  } catch (error: any) {
    console.error("Error:", error.message);
  }
};

// Usage: createTestThread("client@example.com", "Client Name")
// Change this email to an address you control for testing
createTestThread("contact@nurmohammad.pro", "Contact Mailbox");
