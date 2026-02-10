import { withAuth } from "@/app/lib/auth-middleware";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import AgencyProject from "@/app/models/AgencyProject";
import Client from "@/app/models/Client";

export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    // Check if user is admin
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await dbConnect();

    // Fetch all projects with client info
    const projects = await AgencyProject.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Enrich with client data
    const enrichedProjects = await Promise.all(
      projects.map(async (project) => {
        const client = await Client.findById(project.clientId).lean();
        return {
          ...project,
          clientName: client?.name || "Unknown Client",
          clientEmail: client?.email || "",
        };
      })
    );

    // Create activity logs from projects
    const activityLogs = enrichedProjects.map((project) => ({
      time: new Date(project.updatedAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      event: `${project.serviceType.replace(/-/g, " ").toUpperCase()}: ${project.status.replace(/_/g, " ").toUpperCase()} - ${project.title}`,
      type: project.serviceType,
    }));

    return NextResponse.json(
      {
        projects: enrichedProjects,
        activityLogs: activityLogs.sort((a, b) =>
          b.time.localeCompare(a.time)
        ),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin services:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
});
