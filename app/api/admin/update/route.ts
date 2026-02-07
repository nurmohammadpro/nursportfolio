import { withAuth } from "@/app/lib/auth-middleware";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import ServiceRequest from "@/app/models/ServiceRequest";

export const PATCH = withAuth(async (req: NextRequest, { user }) => {
  console.log(`Admin ${user.email} is updating a service request`);
  try {
    const { requestId, progress, status } = await req.json();
    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const updateData: any = {};
    if (progress !== undefined) updateData.progress = progress;
    if (status !== undefined) updateData.status = status;

    const updatedRequest = await ServiceRequest.findByIdAndUpdate(
      requestId,
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json({ message: "Update successful" }, { status: 200 });
  } catch (error) {
    console.error("Failed to update service request:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Could not update service request." },
      { status: 500 },
    );
  }
});
