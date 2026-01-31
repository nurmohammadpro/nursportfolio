import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const subscription = await req.json();

    // We save it as 'nur_mobile' so the webhook knows exactly who to notify
    await adminDb
      .collection("subscriptions")
      .doc("nur_mobile")
      .set(subscription);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
