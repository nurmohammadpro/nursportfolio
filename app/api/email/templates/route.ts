import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import EmailTemplate from "@/app/models/EmailTemplate";

export async function POST(req: Request) {
  try {
    const { name, subject, body } = await req.json();

    await dbConnect();

    const newTemplate = await EmailTemplate.create({
      name,
      subject,
      body,
    });

    return NextResponse.json({ id: newTemplate._id, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
