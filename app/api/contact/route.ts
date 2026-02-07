import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import ContactMessage from "@/app/models/ContactMessage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    //Basic Validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Save data to mongo
    const newMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || null,
      message,
    });

    return NextResponse.json({ success: true, id: newMessage._id }, { status: 200 });
  } catch (error) {
    console.error("Failed to submit contact message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit message" },
      { status: 500 },
    );
  }
}
