import { NextResponse, NextRequest } from "next/server";
import { withAuth } from "@/app/lib/auth-middleware";
import dbConnect from "@/app/lib/dbConnect";
import ServiceRequest from "@/app/models/ServiceRequest";

export const GET = withAuth(async (req: NextRequest, { user }) => {
  console.log(`Admin ${user.email} is accessing the monitor.`);
  try {
    await dbConnect();
    const data = await ServiceRequest.find().sort({ createdAt: -1 });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch monitor data:", error);
    return NextResponse.json(
      { error: "Failed to fetch monitor data" },
      { status: 500 },
    );
  }
});
