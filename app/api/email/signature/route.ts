import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Signature from "@/app/models/Signature";

export async function POST(req: Request) {
  try {
    const { mailboxId, html } = await req.json();

    await dbConnect();

    // 2. Save Signature
    await Signature.findOneAndUpdate(
      { mailboxId: mailboxId },
      { content: html },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("SIGNATURE_SAVE_ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mailboxId = searchParams.get("mailboxId");

    if (!mailboxId) {
      return NextResponse.json({ error: "Mailbox ID is required" }, { status: 400 });
    }

    await dbConnect();

    if (mailboxId) {
      const signature = await Signature.findOne({ mailboxId });
      return NextResponse.json({ signature: signature?.content || "" });
    } else {
      const signatures = await Signature.find();
      return NextResponse.json(signatures);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
