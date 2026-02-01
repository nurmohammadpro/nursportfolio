import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { type, data } = payload;

    // We only care about tracking status updates here
    if (
      [
        "email.sent",
        "email.delivered",
        "email.bounced",
        "email.opened",
      ].includes(type)
    ) {
      const emailId = data.email_id || data.id;

      // Find the message across all projects using the Resend ID
      const messageSnap = await adminDb
        .collectionGroup("messages")
        .where("resendId", "==", emailId)
        .limit(1)
        .get();

      if (!messageSnap.empty) {
        const messageDoc = messageSnap.docs[0];
        // Update the specific message status (e.g., from 'sent' to 'delivered')
        await messageDoc.ref.update({
          deliveryStatus: type.split(".")[1], // 'delivered', 'bounced', etc.
          statusUpdatedAt: new Date().toISOString(),
        });
      }
    }

    // 1. Extract from 'data' object
    const webhookData = payload.data;
    if (!webhookData || payload.type !== "email.received") {
      return NextResponse.json({ ok: true });
    }

    // 2. Extract Sender
    const fromRaw = webhookData.from || "";
    const fromEmail = fromRaw.includes("<")
      ? fromRaw.split("<")[1].replace(">", "").toLowerCase().trim()
      : fromRaw.toLowerCase().trim();

    // 3. Find Thread in Firestore
    const snap = await adminDb
      .collection("projects")
      .where("clientEmail", "==", fromEmail)
      .orderBy("updatedAt", "desc")
      .limit(1)
      .get();

    if (snap.empty) {
      console.log(`No project found for sender: ${fromEmail}`);
      return NextResponse.json({ ok: true });
    }

    const docRef = snap.docs[0].ref;
    const timestamp = new Date().toISOString();

    // 4. Update with limited data (Free Tier)
    await docRef.collection("messages").add({
      text: `Incoming Email: ${webhookData.subject || "No Subject"} (Body hidden in Resend Free Tier)`,
      sender: fromEmail,
      type: "inbound",
      createdAt: timestamp,
    });

    await docRef.update({
      status: "inbox",
      unread: true,
      lastMessage: (webhookData.subject || "New Message Received").slice(
        0,
        100,
      ),
      updatedAt: timestamp,
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return NextResponse.json({ ok: true }); // Always 200 to stop Resend retries
  }
}
