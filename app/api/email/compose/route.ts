import { NextResponse } from "next/server";
import { Resend } from "resend";
import dbConnect from "@/app/lib/dbConnect";
import EmailThread from "@/app/models/EmailThread";

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { to, subject, body, fromEmail, attachments } = await req.json();

    await dbConnect();

    // Create email thread with 'sent' status
    const newThread = await EmailThread.create({
      clientEmail: to.toLowerCase().trim(),
      clientName: to.split("@")[0],
      title: subject,
      description: body,
      fromEmail,
      status: "sent",
      starred: false,
      unread: false,
      messages: [{
        text: body,
        sender: fromEmail,
        type: "outbound",
        createdAt: new Date(),
      }],
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

    return NextResponse.json({ success: true, id: newThread._id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
