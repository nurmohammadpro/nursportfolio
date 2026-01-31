// @/app/api/email/mailbox/create/route.ts
import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { alias, role } = await req.json();

    if (!adminDb) {
      return NextResponse.json(
        { error: "Database connection failed. Check FIREBASE_PROJECT_ID." },
        { status: 500 },
      );
    }

    // Format the email to be the official nurmohammad.pro alias
    const emailAddress = `${alias.toLowerCase().trim()}@nurmohammad.pro`;

    try {
      // 1. Pixel Perfect Check: Does this mailbox already exist?
      const existing = await adminDb
        .collection("mailboxes")
        .where("email", "==", emailAddress)
        .get();

      if (!existing.empty) {
        return NextResponse.json(
          { error: "This mailbox alias already exists." },
          { status: 400 },
        );
      }

      // 2. Provision the Mailbox
      // Firestore will implicitly create the 'mailboxes' collection now that the DB is live
      const docRef = await adminDb.collection("mailboxes").add({
        email: emailAddress,
        role: role,
        createdAt: new Date().toISOString(),
        active: true,
      });

      // 3. Provision the Default Signature
      // Linked via the new document ID for relational integrity
      await adminDb.collection("signatures").add({
        alias: emailAddress,
        mailboxId: docRef.id,
        content: `Best Regards,\nNur Mohammad\nWeb Application Developer | nurmohammad.pro`,
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        email: emailAddress,
        id: docRef.id,
      });
    } catch (dbError: any) {
      // If you see Code 5 here, verify your Project ID in .env matches the console exactly
      console.error("FIRESTORE_FAILURE:", dbError.code, dbError.message);
      return NextResponse.json(
        { error: `Infrastructure Error: ${dbError.message}` },
        { status: 500 },
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
