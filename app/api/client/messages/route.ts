import { withAuth } from "@/app/lib/auth-middleware";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import AgencyProject from "@/app/models/AgencyProject";
import Client from "@/app/models/Client";

export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    await dbConnect();

    // Get client data
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

    // Get recent projects with their status
    const projects = await AgencyProject.find({ clientId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const messages = projects.map((project) => ({
      id: (project as any)._id,
      subject: project.title,
      preview: project.description
        ? project.description.substring(0, 100) + (project.description.length > 100 ? "..." : "")
        : "No description",
      status: project.status,
      date: new Date(project.updatedAt).toLocaleDateString(),
      serviceType: project.serviceType,
    }));

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
});
