export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { adminDb, admin } from "@/app/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    //Basic Validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 },
      );
    }

    // Save data to firerstore
    const docRef = await adminDb.collection("messages").add({
      name,
      email,
      phone: phone || null,
      message,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: docRef.id }, { status: 200 });
  } catch (error) {
    console.error("Failed to submit contact message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit message" },
      { status: 500 },
    );
  }
}
