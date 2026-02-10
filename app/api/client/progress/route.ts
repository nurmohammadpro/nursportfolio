import { withAuth } from "@/app/lib/auth-middleware";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import AgencyProject from "@/app/models/AgencyProject";
import ServiceRequest from "@/app/models/ServiceRequest";

export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    await dbConnect();

    // Fetch projects for this client based on their email
    const projects = await AgencyProject.find({ clientId: user.id })
      .sort({ createdAt: -1 })
      .lean();

    // Also fetch service requests
    const serviceRequests = await ServiceRequest.find({ clientId: user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { projects, serviceRequests },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching client data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
});
