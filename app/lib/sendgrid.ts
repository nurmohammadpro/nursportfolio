import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";
import { uploadUrlToCloudinary } from "@/app/lib/cloudinary";

// SendGrid doesn't have a direct API like Resend for fetching emails
// All data comes through the webhook

export async function processSendGridWebhook(payload: any) {
  console.log("Processing SendGrid webhook...");

  try {
    // SendGrid sends multiple emails in one webhook
    const emails = Array.isArray(payload) ? payload : [payload];

    for (const email of emails) {
      // Extract email data from SendGrid format
      const fromEmail = email.from || email.envelope.from;
      const subject = email.subject || "No Subject";
      const html = email.html || email.body || "";
      const text = email.text || email.body || "";
      const attachments = email.attachments || [];

      console.log(`Processing email from: ${fromEmail}`);
      console.log(`Subject: ${subject}`);
      console.log(`Attachments: ${attachments.length}`);

      // Find or create project
      const snap = await adminDb
        .collection("projects")
        .where("clientEmail", "==", fromEmail.toLowerCase())
        .orderBy("updatedAt", "desc")
        .limit(1)
        .get();

      let docRef;
      const timestamp = new Date().toISOString();

      if (snap.empty) {
        console.log("Creating new project for:", fromEmail);
        const newProjectRef = await adminDb.collection("projects").add({
          clientEmail: fromEmail.toLowerCase(),
          clientName: fromEmail.split("@")[0],
          title: subject,
          status: "inbox",
          unread: true,
          lastMessage: subject.slice(0, 100),
          updatedAt: timestamp,
          createdAt: timestamp,
          description: text || html,
        });
        docRef = newProjectRef;
      } else {
        docRef = snap.docs[0].ref;
      }

      // Process attachments
      const processedAttachments = [];

      for (const attachment of attachments) {
        try {
          // SendGrid attachments are base64 encoded
          const base64Data = attachment.content;
          const buffer = Buffer.from(base64Data, "base64");

          // Convert buffer to base64 data URL
          const dataUrl = `data:${attachment.type};base64,${buffer.toString("base64")}`;

          // Upload to Cloudinary
          const cloudinaryResult = await uploadUrlToCloudinary(
            dataUrl,
            attachment.filename,
            `attachments/${docRef.id}`,
          );

          processedAttachments.push({
            id: attachment.id || Date.now().toString(),
            name: attachment.filename,
            type: attachment.type,
            size: buffer.length,
            url: cloudinaryResult.secure_url,
            publicId: cloudinaryResult.public_id,
            resourceType: cloudinaryResult.resource_type,
            format: cloudinaryResult.format,
          });

          console.log(`✓ Attachment uploaded: ${attachment.filename}`);
        } catch (error) {
          console.error(
            `✗ Error processing attachment ${attachment.filename}:`,
            error,
          );
        }
      }

      // Add message to Firestore
      await docRef.collection("messages").add({
        text: html || text || subject,
        sender: fromEmail,
        type: "inbound",
        createdAt: timestamp,
        attachments: processedAttachments,
      });

      // Update project
      await docRef.update({
        status: "inbox",
        unread: true,
        lastMessage: subject.slice(0, 100),
        updatedAt: timestamp,
      });

      console.log(`✓ Email processed for ${fromEmail}`);
    }

    return { success: true, processed: emails.length };
  } catch (error) {
    console.error("SendGrid processing error:", error);
    throw error;
  }
}
