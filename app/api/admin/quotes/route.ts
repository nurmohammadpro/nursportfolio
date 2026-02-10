import { withAuth } from "@/app/lib/auth-middleware";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Quote from "@/app/models/Quote";
import AgencyProject from "@/app/models/AgencyProject";
import Client from "@/app/models/Client";

export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    // Check if user is admin
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    // Fetch all quotes with project and client info
    const quotes = await Quote.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Enrich with project and client data
    const enrichedQuotes = await Promise.all(
      quotes.map(async (quote) => {
        const project = await AgencyProject.findById(quote.projectId).lean();
        const client = await Client.findById(quote.clientId).lean();

        const projectData = project ? (Array.isArray(project) ? project[0] : project) : null;
        const clientData = client ? (Array.isArray(client) ? client[0] : client) : null;

        return {
          ...quote,
          projectName: projectData?.title || "Unknown Project",
          clientName: clientData?.name || "Unknown Client",
          clientEmail: clientData?.email || "",
          serviceType: projectData?.serviceType || "web-development",
        };
      })
    );

    return NextResponse.json({ quotes: enrichedQuotes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});

export const POST = withAuth(async (req: NextRequest, { user }) => {
  try {
    // Check if user is admin
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();
    const body = await req.json();
    const { subject, amount, projectId, clientId } = body;

    // Validate required fields
    if (!subject || !amount || !projectId || !clientId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new quote
    const quote = await Quote.create({
      subject,
      amount: parseFloat(amount),
      projectId,
      clientId,
      status: "pending",
    });

    return NextResponse.json({ quote }, { status: 201 });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
