import { withAuth } from "@/app/lib/auth-middleware";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Quote from "@/app/models/Quote";

export const PATCH = withAuth(async (
  req: NextRequest,
  { params, user }: { params: { id: string }; user: any }
) => {
  try {
    // Check if user is admin
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const body = await req.json();
    const { status } = body;

    // Update quote
    const quote = await Quote.findByIdAndUpdate(
      params.id,
      {
        status,
        ...(status === "sent" && { sentAt: new Date() })
      },
      { new: true, lean: true }
    );

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({ quote }, { status: 200 });
  } catch (error) {
    console.error("Error updating quote:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});

export const DELETE = withAuth(async (
  req: NextRequest,
  { params, user }: { params: { id: string }; user: any }
) => {
  try {
    // Check if user is admin
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const quote = await Quote.findByIdAndDelete(params.id);

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Quote deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting quote:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
