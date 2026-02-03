import { NextResponse } from "next/server";
import { processMailjetWebhook } from "@/app/lib/mailjet";

export async function POST(req: Request) {
  console.log("=== MAILJET WEBHOOK RECEIVED ===");
  
  try {
    const payload = await req.json();
    
    // Log for debugging
    console.log("Mailjet keys:", Object.keys(payload));
    console.log("From:", payload.Sender || payload.From);
    console.log("Subject:", payload.Subject);
    
    // Process the email
    const result = await processMailjetWebhook(payload);
    
    return NextResponse.json({ 
      message: "Email processed",
      ...result
    });
    
  } catch (error: any) {
    console.error("Mailjet webhook error:", error);
    
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}