import { withAuth } from "@/app/lib/auth-middleware";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import ServiceRequest from "@/app/models/ServiceRequest";

export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    await dbConnect();
    //Fetching progress data for client
    const services = await ServiceRequest.find({ clientId: user.id }).sort({ createdAt: -1 });

    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.error("Error fetching progress data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
});
