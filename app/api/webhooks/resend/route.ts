import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    // Resend Inbound Payload Structure
    const { from, to, subject, text, html } = payload;
    const toAddress = to[0];

    // Extract clean email from "Name <email@domain.com>"
    const fromEmail = from.includes("<")
      ? from.split("<")[1].replace(">", "")
      : from;

    let projectId = toAddress.split("+")[1]?.split("@")[0];
    let docRef;

    if (projectId) {
      docRef = adminDb.collection("projects").doc(projectId);
    } else {
      // Fallback: Search by client email
      const projectQuery = await adminDb
        .collection("projects")
        .where("clientEmail", "==", fromEmail)
        .orderBy("updatedAt", "desc")
        .limit(1)
        .get();

      if (!projectQuery.empty) docRef = projectQuery.docs[0].ref;
    }

    if (!docRef)
      return NextResponse.json({ error: "No thread found" }, { status: 200 });

    const timestamp = new Date().toISOString();

    // 1. Add message to sub-collection for real-time UI updates
    await docRef.collection("messages").add({
      text: text || html,
      sender: fromEmail,
      type: "inbound",
      createdAt: timestamp,
    });

    // 2. Move to Inbox and mark Unread
    await docRef.update({
      unread: true,
      status: "inbox",
      lastMessage: text?.slice(0, 100) || "New reply received",
      updatedAt: timestamp,
    });

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
