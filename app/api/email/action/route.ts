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

    if (action === "archive") {
      await docRef.update({
        status: "archived",
        updatedAt: new Date().toISOString(),
      });
    } else if (action === "markAsRead") {
      await docRef.update({ unread: false });
    } else if (action === "delete") {
      // Logic for standard permanent deletion
      await docRef.delete();
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
