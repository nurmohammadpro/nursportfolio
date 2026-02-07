import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import EmailThread from "@/app/models/EmailThread";

export async function POST(req: Request) {
  try {
    const { to, subject, body, fromEmail, projectId } = await req.json();

    // Send email using SendGrid API
    const sendgridResponse = await fetch(
      "https://api.sendgrid.com/v3/mail/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: to }],
              subject: subject,
            },
          ],
          from: { email: fromEmail },
          content: [
            {
              type: "text/html",
              value: body,
            },
          ],
        }),
      },
    );

    if (!sendgridResponse.ok) {
      throw new Error("Failed to send email");
    }

    await dbConnect();

    // Save to Mongo
    await EmailThread.findByIdAndUpdate(projectId, {
      $push: {
        messages: {
          text: body,
          sender: fromEmail,
          type: "outbound",
          createdAt: new Date(),
          deliveryStatus: "sent",
        },
      },
      $set: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Send email error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
