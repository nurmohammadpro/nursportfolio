import { NextResponse, NextRequest } from "next/server";
import { Resend } from "resend";
import dbConnect from "@/app/lib/dbConnect";
import Client from "@/app/models/Client";
import AgencyProject from "@/app/models/AgencyProject";
import {
  InquiryData,
  ServiceType,
  Milestone,
} from "@/app/lib/agency-types";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  if (!resend) {
    console.error("RESEND_API_KEY is missing from environment variables.");
  }
  try {
    const body: InquiryData = await req.json();

    const { name, email, serviceType, projectDescription } = body;
    if (!name || !email || !serviceType || !projectDescription) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 },
      );
    }

    await dbConnect();

    // 1. Client Management
    let client = await Client.findOne({ email });

    if (!client) {
      client = await Client.create({
        name,
        email,
        phone: body.phone ?? null,
        company: body.company ?? null,
        source: "portfolio_inquiry",
      });
    }

    // 2. Project Creation
    const newProject = await AgencyProject.create({
      clientId: client._id,
      serviceType,
      title: `Inquiry: ${serviceType.replace("-", " ")}`,
      description: projectDescription,
      status: "new_inquiry",
      progress: 0,
      milestones: getDefaultMilestones(serviceType),
      paymentModel: "advance",
      totalPrice: body.budget
        ? parseFloat(body.budget.replace(/[^0-9.]/g, ""))
        : 0,
    });

    // 3. Email Notification
    try {
      await resend.emails.send({
        from: "Portfolio <onboarding@resend.dev>",
        to: process.env.ADMIN_EMAIL || "your-email@example.com",
        subject: `New Project Request: ${name}`,
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h2>New ${serviceType} Inquiry</h2>
            <p><strong>Client:</strong> ${name} (${email})</p>
            <p><strong>Description:</strong> ${projectDescription}</p>
            <p><strong>Budget:</strong> ${body.budget || "Not provided"}</p>
          </div>
        `,
      });
    } catch (e) {
      console.error("Email failed", e);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

function getDefaultMilestones(serviceType: ServiceType): Milestone[] {
  return [
    { label: "Consultation", completed: true },
    { label: "Technical Blueprint", completed: false },
    { label: "Development", completed: false },
    { label: "Deployment", completed: false },
  ];
}
