import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import EmailTemplate from "@/app/models/EmailTemplate";

export async function GET() {
  try {
    await dbConnect();
    const templates = await EmailTemplate.find().sort({ createdAt: -1 });
    return NextResponse.json(templates);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { label, subject, body, category } = await req.json();

    await dbConnect();

    const newTemplate = await EmailTemplate.create({
      label,
      subject,
      body,
      category,
    });

    return NextResponse.json({ id: newTemplate._id, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
