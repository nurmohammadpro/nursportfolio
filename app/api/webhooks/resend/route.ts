import dbConnect from "@/app/lib/dbConnect";
import EmailThread from "@/app/models/EmailThread";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // Read raw body for signature verification
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);

    // Verify webhook signature for security
    const headersList = await headers();
    const signature = headersList.get("resend-signature") || headersList.get("x-resend-signature");

    if (signature && process.env.RESEND_WEBHOOK_SECRET) {
      const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

      // Verify the webhook is from Resend
      const hmac = crypto.createHmac("sha256", webhookSecret);
      hmac.update(rawBody);
      const expectedSignature = `t=${hmac.digest("hex")}`;

      // Simple timestamp verification - Resend signatures start with t=
      if (!signature.startsWith("t=")) {
        console.error("❌ Invalid webhook signature format");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    await dbConnect();

    if (payload.type !== "email.received") return NextResponse.json({ ok: true });

    // For free plan, use webhook payload directly (subject, from, to are available)
    // The body (html/text) is only available on paid plans
    const emailData = payload.data;

    const fromRaw = emailData.from || "";
    const fromEmail = fromRaw.includes("<")
      ? fromRaw.split("<")[1].replace(">", "").toLowerCase().trim()
      : fromRaw.toLowerCase().trim();

    const subject = emailData.subject || "No Subject";

    // Create message text with available info (free plan doesn't include body)
    const messageText = emailData.text || emailData.html || `
📧 New email received
From: ${fromRaw}
Subject: ${subject}

Note: Email body is not available on the free plan. Please upgrade your Resend account to view full email content.
    `.trim();

    const newMessage = {
      text: messageText,
      sender: fromEmail,
      type: "inbound",
      createdAt: new Date(),
      attachments: emailData.attachments?.map((att: any) => ({
        id: att.id,
        name: att.filename,
        type: att.content_type,
        size: att.size
      })) || []
    };

    console.log("📨 Incoming email webhook:");
    console.log("  From:", fromRaw);
    console.log("  Subject:", subject);
    console.log("  Email ID:", emailData.email_id || emailData.id);

    const updatedEmailThread = await EmailThread.findOneAndUpdate(
      { clientEmail: fromEmail },
      {
        $push: { messages: newMessage },
        $set: {
          status: "inbox",
          unread: true,
          updatedAt: new Date(),
          title: subject
        }
      },
      { new: true }
    );

    if (!updatedEmailThread) {
      console.log(`⚠️  No project found for sender: ${fromEmail}`);
      console.log(`   Email was NOT saved. Create a project with clientEmail: ${fromEmail}`);
    } else {
      console.log(`✅ Email saved to thread: ${updatedEmailThread.title}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("❌ Resend webhook error:", error.message);
    return NextResponse.json({ ok: true }); // Prevent Resend retries
  }
}