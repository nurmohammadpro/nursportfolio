import { adminDb } from "@/app/lib/firebase-admin";
import { Resend } from "resend";
import { NextResponse } from "next/server";

// Initialize Resend outside the handler for better performance in Next.js

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    // 1. Extract data from the request body first
    const { projectId, text, clientEmail, subject, fromEmail } =
      await req.json();

    if (!projectId || !fromEmail || !clientEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 2. Fetch the professional signature linked to this alias
    const signatureSnap = await adminDb
      .collection("signatures")
      .where("alias", "==", fromEmail)
      .limit(1)
      .get();

    const signature = signatureSnap.empty
      ? ""
      : signatureSnap.docs[0].data().content;

    // 3. Combine message text and signature using your high-density format
    const fullBody = `${text}\n\n--\n${signature}`;

    // 4. Save to Firestore immediately for real-time dashboard sync
    const messageData = {
      text: fullBody,
      sender: "admin",
      createdAt: new Date().toISOString(),
      type: "outbound",
    };

    await adminDb
      .collection("projects")
      .doc(projectId)
      .collection("messages")
      .add(messageData);

    // 5. Transmit via Resend using your new .pro domain
    await resend.emails.send({
      from: `Nur Mohammad <${fromEmail}>`, // Dynamically uses nur@nurmohammad.pro etc.
      to: clientEmail,
      subject: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
      replyTo: `reply+${projectId}@nurmohammad.pro`, // Encoded for your Resend webhook
      text: fullBody,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Transmission Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
