import { withAuth } from "@/app/lib/auth-middleware";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import AgencyProject from "@/app/models/AgencyProject";
import Client from "@/app/models/Client";

export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    // Check if user is admin
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    // Fetch clients - those who have submitted inquiries
    const clients = await Client.find({})
      .sort({ name: 1 })
      .select("name email company")
      .lean();

    // Fetch projects that are in inquiry/proposal stage
    // These are projects where you'd want to send a quote
    const projects = await AgencyProject.find({
      status: {
        $in: ["new_inquiry", "contacted", "proposal_sent"]
      }
    })
      .sort({ createdAt: -1 }) // Most recent first
      .select("title serviceType clientId status createdAt")
      .lean();

    // Enrich projects with client names and add formatted display info
    const enrichedProjects = await Promise.all(
      projects.map(async (project) => {
        const client = await Client.findById(project.clientId).lean();
        return {
          ...project,
          clientName: client?.name || "Unknown",
          clientCompany: client?.company || "",
          // Format status for display
          statusDisplay: project.status.replace(/_/g, " ").toUpperCase(),
          // Service type formatted
          serviceDisplay: project.serviceType?.replace(/-/g, " ") || "Web Development",
        };
      })
    );

    return NextResponse.json(
      {
        clients,
        projects: enrichedProjects,
        summary: {
          totalClients: clients.length,
          totalProjects: enrichedProjects.length,
          quoteableProjects: enrichedProjects.length
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching form data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
