// @/app/api/inquiry/route.ts

import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse, NextRequest } from "next/server";
import {
  InquiryData,
  Project,
  Client,
  ServiceType,
} from "@/app/lib/agency-types";

export async function POST(req: NextRequest) {
  try {
    const body: InquiryData = await req.json();

    // 1. Validate the incoming data
    const { name, email, serviceType, projectDescription } = body;
    if (!name || !email || !serviceType || !projectDescription) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, email, serviceType, and projectDescription are required.",
        },
        { status: 400 },
      );
    }

    // 2. Check if the client already exists (by email)
    const clientsRef = adminDb.collection("clients");
    const clientSnapshot = await clientsRef
      .where("email", "==", email)
      .limit(1)
      .get();
    let clientId: string;

    if (clientSnapshot.empty) {
      // If client doesn't exist, create them
      const newClientRef = clientsRef.doc();
      const now = new Date().toISOString();

      // FIX: Create the full Client object explicitly
      const newClient: Client = {
        id: newClientRef.id,
        name,
        email,
        phone: body.phone || null,
        company: body.company || null,
        source: "contact-form",
        createdAt: now,
        updatedAt: now,
      };
      await newClientRef.set(newClient);
      clientId = newClientRef.id;
    } else {
      // If client exists, use their ID
      clientId = clientSnapshot.docs[0].id;
    }

    // 3. Create the new project
    const projectsRef = adminDb.collection("projects");
    const newProjectRef = projectsRef.doc();

    // Define default milestones based on service type
    const defaultMilestones = getDefaultMilestones(serviceType);
    const now = new Date().toISOString();

    // FIX: Create the full Project object explicitly
    const newProject: Project = {
      id: newProjectRef.id,
      clientId,
      serviceType,
      title: `New ${serviceType.replace("-", " ")} Inquiry`,
      description: projectDescription,
      status: "new_inquiry",
      progress: 0,
      milestones: defaultMilestones,
      createdAt: now,
      updatedAt: now,
    };

    await newProjectRef.set(newProject);

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your inquiry! We will get back to you soon.",
        projectId: newProjectRef.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create inquiry:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Could not submit inquiry." },
      { status: 500 },
    );
  }
}

/**
 * Helper function to get default milestones for a given service type.
 */
function getDefaultMilestones(
  serviceType: ServiceType,
): { label: string; completed: boolean }[] {
  switch (serviceType) {
    case "web-development":
      return [
        { label: "Discovery & Planning", completed: false },
        { label: "UI/UX Design", completed: false },
        { label: "Development", completed: false },
        { label: "Testing & QA", completed: false },
        { label: "Deployment & Launch", completed: false },
      ];
    case "wordpress-design":
      return [
        { label: "Requirements Gathering", completed: false },
        { label: "Theme Selection & Customization", completed: false },
        { label: "Content Setup", completed: false },
        { label: "Review & Go-Live", completed: false },
      ];
    case "automation-bot":
      return [
        { label: "Process Analysis", completed: false },
        { label: "Bot Development", completed: false },
        { label: "Testing & Integration", completed: false },
        { label: "Deployment & Training", completed: false },
      ];
    case "security-audit":
      return [
        { label: "Scoping & Planning", completed: false },
        { label: "Vulnerability Scanning", completed: false },
        { label: "Manual Testing & Analysis", completed: false },
        { label: "Report Generation", completed: false },
      ];
    default:
      return [
        { label: "Project Kick-off", completed: false },
        { label: "In Progress", completed: false },
        { label: "Final Delivery", completed: false },
      ];
  }
}
