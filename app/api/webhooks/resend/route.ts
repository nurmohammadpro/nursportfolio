import dbConnect from "@/app/lib/dbConnect";
import EmailThread from "@/app/models/EmailThread";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await dbConnect(); 
    const payload = await req.json();
    
    if (payload.type !== "email.received") return NextResponse.json({ ok: true });

    const emailId = payload.data?.email_id || payload.data?.id;
    let emailData = payload.data;

    // Fetch full content using the Resend Receiving API
    if (emailId && !emailId.startsWith("re_ts_")) {
      const { data } = await resend.emails.receiving.get(emailId);
      if (data) emailData = data;
    }

    const fromRaw = emailData.from || "";
    const fromEmail = fromRaw.includes("<") 
      ? fromRaw.split("<")[1].replace(">", "").toLowerCase().trim() 
      : fromRaw.toLowerCase().trim();
    const newMessage = {
      text: emailData.html || emailData.text || `Subject: ${emailData.subject}`,
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

    const updatedEmailThread = await EmailThread.findOneAndUpdate(
      { clientEmail: fromEmail },
      { 
        $push: { messages: newMessage },
        $set: { 
          status: "inbox", 
          unread: true, 
          updatedAt: new Date(),
          title: emailData.subject || "No Subject" // Optional: Update thread title
        } 
      },
      { new: true }
    );

    if (!updatedEmailThread) {
      console.log(`No project found for sender: ${fromEmail}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Mongoose Inbound Error:", error.message);
    return NextResponse.json({ ok: true }); // Prevent Resend retries
  }
}