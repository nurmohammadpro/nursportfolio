import { withAuth } from "@/app/lib/auth-middleware";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import AgencyProject from "@/app/models/AgencyProject";
import Client from "@/app/models/Client";

export const GET = withAuth(async (
  req: NextRequest,
  { params, user }: { params: { id: string }; user: any }
) => {
  try {
    await dbConnect();

    // Get client to verify ownership
    const client = await Client.findOne({ email: user.email }).lean();

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Get project
    const project = await AgencyProject.findOne({
      _id: params.id,
      clientId: client._id.toString(),
    }).lean();

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
});
