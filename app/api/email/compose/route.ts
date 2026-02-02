import { adminDb, adminAuth } from "@/app/lib/firebase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { to, subject, body, fromEmail, attachments } = await req.json();

    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const timestamp = new Date().toISOString();

    // Create project with 'sent' status so it doesn't appear in Inbox
    const projectRef = await adminDb.collection("projects").add({
      clientEmail: to.toLowerCase().trim(),
      clientName: to.split("@")[0],
      title: subject,
      description: body,
      fromEmail, // Critical for mailbox shifting logic
      status: "sent",
      starred: false,
      unread: false,
      updatedAt: timestamp,
      createdAt: timestamp,
    });

    // Add initial message to the sub-collection
    await projectRef.collection("messages").add({
      text: body,
      sender: fromEmail,
      type: "outbound",
      createdAt: timestamp,
    });

    // Send via Resend
    await resend.emails.send({
      from: `Nur Mohammad <${fromEmail}>`,
      to: [to],
      subject: subject,
      attachments: attachments?.map((a: any) => ({
        filename: a.name,
        path: a.url,
      })),
      text: body,
    });

    return NextResponse.json({ success: true, id: projectRef.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
