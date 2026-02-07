import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Mailbox from "@/app/models/Mailbox";

export async function GET() {
  try {
    await dbConnect();
    const mailboxes = await Mailbox.find().sort({ createdAt: -1 });
    return NextResponse.json(mailboxes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
