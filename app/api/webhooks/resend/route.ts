// app/api/webhooks/resend/route.ts
import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { uploadUrlToCloudinary } from "@/app/lib/cloudinary";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  console.log("=== WEBHOOK REQUEST START ===");

  try {
    const payload = await req.json();
    console.log("Payload type:", payload.type);
    console.log("Payload keys:", Object.keys(payload));

    // Log the entire payload for debugging
    if (payload.type === "email.received") {
      console.log("Email payload:", JSON.stringify(payload, null, 2));
    }

    // 1. Listen for the 'email.received' event
    if (payload.type !== "email.received") {
      console.log("Not an email.received event, returning early");
      return NextResponse.json({ ok: true, message: "Not an email event" });
    }

    console.log("Processing email.received event...");

    // The webhook payload nests ID inside 'data'
    const emailId = payload.data?.email_id || payload.data?.id;
    console.log("Email ID:", emailId);

    let fullEmail = payload.data;
    console.log("Initial email data keys:", Object.keys(fullEmail || {}));

    // 2. FETCH FULL CONTENT
    if (emailId && !emailId.startsWith("re_ts_")) {
      console.log("Fetching full email content...");
      try {
        const { data, error } = await resend.emails.receiving.get(emailId);
        if (data) {
          fullEmail = data;
          console.log("Full email fetched successfully");
          console.log("From:", fullEmail.from);
          console.log("Subject:", fullEmail.subject);
          console.log("Has attachments:", !!fullEmail.attachments?.length);
        }
        if (error) {
          console.error("Resend API error:", error);
        }
      } catch (fetchErr) {
        console.error("Resend Receiving API error:", fetchErr);
      }
    }

    // 3. IDENTIFY SENDER
    const fromRaw = fullEmail?.from || "";
    console.log("Raw from field:", fromRaw);

    const fromEmail = fromRaw.includes("<")
      ? fromRaw.split("<")[1].replace(">", "").toLowerCase().trim()
      : fromRaw.toLowerCase().trim();

    console.log("Extracted email:", fromEmail);

    if (!fromEmail) {
      console.error("No sender email found");
      return NextResponse.json({ ok: true, message: "No sender email" });
    }

    // 4. FIND PROJECT
    console.log("Searching for project with email:", fromEmail);
    const snap = await adminDb
      .collection("projects")
      .where("clientEmail", "==", fromEmail)
      .orderBy("updatedAt", "desc")
      .limit(1)
      .get();

    let docRef;
    const timestamp = new Date().toISOString();

    // If no project exists, create a new one
    if (snap.empty) {
      console.log("No existing project found, creating new one...");
      const newProjectRef = await adminDb.collection("projects").add({
        clientEmail: fromEmail,
        clientName: fromEmail.split("@")[0],
        title: fullEmail?.subject || "New Inquiry",
        status: "inbox",
        unread: true,
        lastMessage: (fullEmail?.subject || "New Message").slice(0, 100),
        updatedAt: timestamp,
        createdAt: timestamp,
        description: fullEmail?.text || fullEmail?.html || "",
      });
      docRef = newProjectRef;
      console.log("Created new project with ID:", docRef.id);
    } else {
      docRef = snap.docs[0].ref;
      console.log("Found existing project with ID:", docRef.id);
    }

    // 5. PROCESS ATTACHMENTS
    const processedAttachments = [];

    if (fullEmail?.attachments && fullEmail.attachments.length > 0) {
      console.log(`Processing ${fullEmail.attachments.length} attachments...`);

      for (const attachment of fullEmail.attachments) {
        try {
          console.log(`Processing attachment: ${attachment.filename}`);

          // For Resend attachments, we need to get the download URL
          let downloadUrl = attachment.url;

          // If no direct URL, try to get it from the raw email
          if (!downloadUrl && fullEmail.raw && fullEmail.raw.download_url) {
            downloadUrl = fullEmail.raw.download_url;
          }

          if (!downloadUrl) {
            console.error(
              `No download URL for attachment: ${attachment.filename}`,
            );
            continue;
          }

          // Upload to Cloudinary
          const cloudinaryResult = await uploadUrlToCloudinary(
            downloadUrl,
            attachment.filename,
            `attachments/${docRef.id}`,
          );

          processedAttachments.push({
            id: attachment.id,
            name: attachment.filename,
            type: attachment.content_type,
            size: attachment.size,
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
    }

    // 6. ADD MESSAGE TO FIRESTORE
    console.log("Adding message to Firestore...");
    await docRef.collection("messages").add({
      text:
        fullEmail?.html || fullEmail?.text || `Subject: ${fullEmail?.subject}`,
      sender: fromEmail,
      type: "inbound",
      createdAt: timestamp,
      attachments: processedAttachments,
    });
    console.log("✓ Message added to Firestore");

    // 7. UPDATE PROJECT
    console.log("Updating project...");
    await docRef.update({
      status: "inbox",
      unread: true,
      lastMessage: (fullEmail?.subject || "New Message").slice(0, 100),
      updatedAt: timestamp,
    });
    console.log("✓ Project updated");

    console.log("=== WEBHOOK PROCESSING COMPLETE ===");
    return NextResponse.json({ ok: true, message: "Email processed" });
  } catch (error: any) {
    console.error("=== WEBHOOK ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // Log error to Firestore for debugging
    try {
      await adminDb.collection("webhook_errors").add({
        timestamp: new Date().toISOString(),
        error: error.message,
        stack: error.stack,
      });
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }

    return NextResponse.json({ ok: true, message: "Error occurred" });
  }
}
