import { adminDb, adminAuth } from "@/app/lib/firebase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const { threadId, action } = await req.json();
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if (!session || !adminAuth)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const docRef = adminDb.collection("projects").doc(threadId);
    const timestamp = new Date().toISOString();

    switch (action) {
      case "archive":
        await docRef.update({
          status: "archive",
          updatedAt: timestamp,
        });
        break;

      case "trash":
        await docRef.update({
          status: "trash",
          updatedAt: timestamp,
        });
        break;

      case "restore":
        // Move back to inbox
        await docRef.update({
          status: "inbox",
          updatedAt: timestamp,
        });
        break;

      case "spam":
        await docRef.update({
          status: "spam",
          updatedAt: timestamp,
        });
        break;

      case "toggleRead":
        const docSnap = await docRef.get();
        if (docSnap.exists) {
          const currentUnread = docSnap.data()?.unread;
          await docRef.update({ unread: !currentUnread });
        }
        break;

      case "markAsRead":
        await docRef.update({ unread: false });
        break;

      case "delete":
        // Permanent deletion
        await docRef.delete();
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
