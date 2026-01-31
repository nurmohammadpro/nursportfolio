import { adminDb, adminAuth } from "@/app/lib/firebase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { projectId, text, clientEmail, subject, fromEmail } =
      await req.json();

    // 1. Session Verification
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session || !adminAuth)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Fetch the Mailbox and its Signature
    const mailboxQuery = await adminDb
      .collection("mailboxes")
      .where("email", "==", fromEmail)
      .limit(1)
      .get();

    let finalHtml = `<div style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">${text.replace(/\n/g, "<br/>")}</div>`;

    if (!mailboxQuery.empty) {
      const mailboxId = mailboxQuery.docs[0].id;
      const sigDoc = await adminDb
        .collection("mailboxes")
        .doc(mailboxId)
        .collection("signatures")
        .doc("default")
        .get();

      if (sigDoc.exists) {
        // Append the HTML signature with a spacer
        finalHtml += `<br/><br/><hr style="border:none; border-top:1px solid #eee; margin: 20px 0;" />${sigDoc.data()?.html}`;
      }
    }

    // 3. Send via Resend
    const { data, error } = await resend.emails.send({
      from: `Nur Mohammad <${fromEmail}>`,
      to: [clientEmail],
      subject: subject,
      html: finalHtml, // Use 'html' instead of 'text' for signature support
    });

    if (error) throw new Error(error.message);

    // 4. Update Firestore Thread
    await adminDb
      .collection("projects")
      .doc(projectId)
      .collection("messages")
      .add({
        text,
        sender: "admin",
        createdAt: new Date().toISOString(),
      });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
