// @/app/api/email/mailbox/create/route.ts
import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { alias, role } = await req.json();

    // Verification check: Ensure adminDb is active and linked to nurmohammad.pro
    if (!adminDb) {
      console.error("FIREBASE_INIT_FAILURE: adminDb is null");
      return NextResponse.json(
        { error: "Database not initialized" },
        { status: 500 },
      );
    }

    const emailAddress = `${alias.toLowerCase()}@nurmohammad.pro`;

    // 1. Check if the 'mailboxes' collection actually exists or is accessible
    // Using a try-catch specifically for the write operation helps isolate '5 NOT_FOUND'
    try {
      const docRef = await adminDb.collection("mailboxes").add({
        email: emailAddress,
        role: role,
        createdAt: new Date().toISOString(),
        active: true,
      });

      // 2. Automated signature creation for the new identity
      await adminDb.collection("signatures").add({
        alias: emailAddress,
        mailboxId: docRef.id,
        content: `Best Regards,\nNur Mohammad\nWeb Application Developer | nurmohammad.pro`,
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({ success: true, email: emailAddress });
    } catch (dbError: any) {
      // If code is 5, it's definitely the collection path or project ID mismatch
      console.error("FIRESTORE_WRITE_ERROR:", dbError.code, dbError.message);
      return NextResponse.json(
        { error: `Firestore Error: ${dbError.message}` },
        { status: 500 },
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
