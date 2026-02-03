import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";
import { uploadToCloudinary } from "@/app/lib/cloudinary";

// Mailjet webhook payload structure
interface MailjetEmail {
  Sender: string;
  From: string;
  Subject: string;
  TextPart: string;
  HtmlPart: string;
  Attachments: Array<{
    ContentType: string;
    Filename: string;
    ContentID: string;
    Size: number;
    URL: string;
  }>;
}

export async function processMailjetWebhook(payload: MailjetEmail) {
  console.log("Processing Mailjet webhook...");

  try {
    // Extract email data
    const fromEmail = payload.Sender || payload.From;
    const subject = payload.Subject || "No Subject";
    const html = payload.HtmlPart || "";
    const text = payload.TextPart || "";
    const attachments = payload.Attachments || [];

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
        // Download the attachment from Mailjet URL
        const response = await fetch(attachment.URL);
        if (!response.ok) {
          console.error(
            `Failed to download attachment: ${attachment.Filename}`,
          );
          continue;
        }

        const buffer = Buffer.from(await response.arrayBuffer());

        const cloudinaryResult = await uploadToCloudinary(
          buffer,
          attachment.Filename,
          `attachments/${docRef.id}`,
        );

        processedAttachments.push({
          id: attachment.ContentID || Date.now().toString(),
          name: attachment.Filename,
          type: attachment.ContentType,
          size: attachment.Size,
          url: cloudinaryResult.secure_url,
          publicId: cloudinaryResult.public_id,
          resourceType: cloudinaryResult.resource_type,
          format: cloudinaryResult.format,
        });

        console.log(`✓ Attachment uploaded: ${attachment.Filename}`);
      } catch (error) {
        console.error(
          `✗ Error processing attachment ${attachment.Filename}:`,
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

    return { success: true, processed: 1 };
  } catch (error) {
    console.error("Mailjet processing error:", error);
    throw error;
  }
}
