import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Resend sends the 'To' address which contains our encoded projectId
    // e.g., reply+PROJECT_ID_HERE@yourdomain.com
    const toAddress = payload.data.to[0];
    const projectId = toAddress.split("+")[1].split("@")[0];

    if (!projectId) return NextResponse.json({ error: "No Project ID" });

    // Store the incoming reply in the correct thread
    await adminDb
      .collection("projects")
      .doc(projectId)
      .collection("messages")
      .add({
        text: payload.data.text,
        sender: "client",
        createdAt: new Date().toISOString(),
        type: "inbound",
      });

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
