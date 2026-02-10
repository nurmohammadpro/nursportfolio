import { withAuth } from "@/app/lib/auth-middleware";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Client from "@/app/models/Client";
import AgencyProject from "@/app/models/AgencyProject";

export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    await dbConnect();

    // Get client data by email
    const client = await Client.findOne({ email: user.email }).lean();

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Handle lean() result which could be array or single object
    const clientData = Array.isArray(client) ? client[0] : client;
    const clientId = (clientData as any)._id.toString();

    // Get project count and latest project
    const projects = await AgencyProject.find({ clientId })
      .sort({ createdAt: -1 })
      .limit(1)
      .lean();

    const latestProject = projects[0] || null;

    return NextResponse.json({
      client: clientData,
      latestProject,
      projectCount: await AgencyProject.countDocuments({ clientId })
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching client profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
});

export const PUT = withAuth(async (req: NextRequest, { user }) => {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, phone, company } = body;

    // Update client data
    const updatedClient = await Client.findOneAndUpdate(
      { email: user.email },
      { name, phone, company },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      client: updatedClient
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating client profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
});
