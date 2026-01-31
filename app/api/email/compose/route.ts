import { adminDb, adminAuth } from "@/app/lib/firebase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { clientEmail, title, description, fromEmail, attachments } =
      await req.json();

    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const timestamp = new Date().toISOString();

    // Create project with 'sent' status so it doesn't appear in Inbox
    const projectRef = await adminDb.collection("projects").add({
      clientEmail,
      clientName: clientEmail.split("@")[0],
      title,
      description,
      fromEmail, // Critical for mailbox shifting logic
      status: "sent",
      starred: false,
      unread: false,
      updatedAt: timestamp,
      createdAt: timestamp,
    });

    // Add initial message to the sub-collection
    await projectRef.collection("messages").add({
      text: description,
      sender: fromEmail,
      type: "outbound",
      createdAt: timestamp,
    });

    // Send via Resend
    await resend.emails.send({
      from: `Nur Mohammad <${fromEmail}>`,
      to: [clientEmail],
      subject: title,
      attachments: attachments?.map((a: any) => ({
        filename: a.name,
        path: a.url,
      })),
      text: description,
    });

    return NextResponse.json({ success: true, id: projectRef.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
