// app/api/webhooks/resend/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";

export async function POST(req: Request) {
  console.log("=== WEBHOOK START ===");

  try {
    // Just log that we received something
    await adminDb.collection("webhook_raw").add({
      timestamp: new Date().toISOString(),
      received: true,
      method: req.method,
    });

    // Try to parse the payload
    let payload;
    try {
      payload = await req.json();
      await adminDb.collection("webhook_raw").add({
        timestamp: new Date().toISOString(),
        type: payload.type,
        hasData: !!payload.data,
      });
    } catch (e: any) {
      await adminDb.collection("webhook_raw").add({
        timestamp: new Date().toISOString(),
        error: "Failed to parse JSON",
        errorMessage: e.message,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    await adminDb.collection("webhook_raw").add({
      timestamp: new Date().toISOString(),
      error: "Webhook failed",
      errorMessage: error.message,
    });

    return NextResponse.json({ error: true });
  }
}
