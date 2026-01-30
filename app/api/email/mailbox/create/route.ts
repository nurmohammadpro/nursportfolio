import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { alias, role } = await req.json();

    if (!adminDb) {
      throw new Error("Firestore Admin instance is not initialized.");
    }

    const emailAddress = `${alias.toLowerCase()}@nurmohammad.pro`;

    // Use a direct collection reference
    const collectionRef = adminDb.collection("mailboxes");

    const docRef = await collectionRef.add({
      email: emailAddress,
      role: role,
      createdAt: new Date().toISOString(),
      active: true,
    });

    // Create the signature profile automatically
    await adminDb.collection("signatures").add({
      alias: emailAddress,
      mailboxId: docRef.id,
      content: `Best Regards,\nNur Mohammad\nWeb Application Developer | nurmohammad.pro`,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, email: emailAddress });
  } catch (error: any) {
    console.error("DEBUG_ERROR_CODE:", error.code); // Look for 5 here
    console.error("DEBUG_ERROR_MESSAGE:", error.message);

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
