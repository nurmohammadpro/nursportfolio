// app/api/webhooks/sendgrid/route.ts
import { NextResponse } from "next/server";
import { processSendGridWebhook } from "@/app/lib/sendgrid";

export async function POST(req: Request) {
  console.log("=== SENDGRID WEBHOOK RECEIVED ===");

  try {
    // SendGrid sends raw form data, not JSON
    const formData = await req.formData();

    // Convert FormData to object
    const payload: any = {};
    for (const [key, value] of formData.entries()) {
      payload[key] = value;
    }

    // Log for debugging
    console.log("SendGrid keys:", Object.keys(payload));
    console.log("From:", payload.from);
    console.log("Subject:", payload.subject);

    // Process the email
    const result = await processSendGridWebhook(payload);

    return NextResponse.json({
      message: "Email processed",
      ...result,
    });
  } catch (error: any) {
    console.error("SendGrid webhook error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
