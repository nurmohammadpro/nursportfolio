import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import EmailThread from "@/app/models/EmailThread";

export async function PATCH(req: Request) {
  try {
    const { threadId, action } = await req.json();

    await dbConnect();

    const timestamp = new Date();

    switch (action) {
      case "archive":
        await EmailThread.findByIdAndUpdate(threadId, {
          status: "archive",
          updatedAt: timestamp,
        });
        break;

      case "trash":
        await EmailThread.findByIdAndUpdate(threadId, {
          status: "trash",
          updatedAt: timestamp,
        });
        break;

      case "restore":
        await EmailThread.findByIdAndUpdate(threadId, {
          status: "inbox",
          updatedAt: timestamp,
        });
        break;

      case "spam":
        await EmailThread.findByIdAndUpdate(threadId, {
          status: "spam",
          updatedAt: timestamp,
        });
        break;

      case "toggleRead":
        const thread = await EmailThread.findById(threadId);
        if (thread) {
          thread.unread = !thread.unread;
          thread.updatedAt = timestamp;
          await thread.save();
        }
        break;

      case "markAsRead":
        await EmailThread.findByIdAndUpdate(threadId, {
          unread: false,
          updatedAt: timestamp,
        });
        break;

      case "delete":
        await EmailThread.findByIdAndDelete(threadId);
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
