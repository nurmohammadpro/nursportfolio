import { adminDb, adminAuth } from "@/app/lib/firebase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { mailboxId, html } = await req.json();

    // 1. Session Verification (Next.js 15 pattern)
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if (!session || !adminAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Save Signature to Sub-collection
    // This utilizes your active IAM roles for Firebase Admin
    await adminDb
      .collection("mailboxes")
      .doc(mailboxId)
      .collection("signatures")
      .doc("default")
      .set(
        {
          html,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("SIGNATURE_SAVE_ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
