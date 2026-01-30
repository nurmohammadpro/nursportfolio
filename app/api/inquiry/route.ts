import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse, NextRequest } from "next/server";
import { Resend } from "resend";
import {
  InquiryData,
  Project,
  Client,
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

    const now = new Date().toISOString();

    // 1. Client Management
    const clientsRef = adminDb.collection("clients");
    const clientSnapshot = await clientsRef
      .where("email", "==", email)
      .limit(1)
      .get();

    let clientId: string;

    if (clientSnapshot.empty) {
      const newClientRef = clientsRef.doc();
      const newClient: Client = {
        id: newClientRef.id,
        name,
        email,
        phone: body.phone ?? null,
        company: body.company ?? null,
        source: "portfolio_inquiry",
        createdAt: now,
        updatedAt: now,
      };
      await newClientRef.set(newClient);
      clientId = newClientRef.id;
    } else {
      clientId = clientSnapshot.docs[0].id;
    }

    // 2. Project Creation (Matching your exact PaymentModel: "milestone" | "advance")
    const projectsRef = adminDb.collection("projects");
    const newProjectRef = projectsRef.doc();

    const newProject: Project = {
      id: newProjectRef.id,
      clientId,
      serviceType,
      title: `Inquiry: ${serviceType.replace("-", " ")}`,
      description: projectDescription,
      status: "new_inquiry",
      progress: 0,
      milestones: getDefaultMilestones(serviceType),
      paymentModel: "advance", // Matches your type: "milestone" | "advance"
      totalPrice: body.budget
        ? parseFloat(body.budget.replace(/[^0-9.]/g, ""))
        : 0,
      createdAt: now,
      updatedAt: now,
    };

    await newProjectRef.set(newProject);

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
