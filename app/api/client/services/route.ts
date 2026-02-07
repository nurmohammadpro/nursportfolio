import { NextResponse, NextRequest } from "next/server";
import { withAuth, AuthenticatedContext } from "@/app/lib/auth-middleware";
import dbConnect from "@/app/lib/dbConnect";
import ServiceRequest from "@/app/models/ServiceRequest";

// Define the allowed package types for validation
const ALLOWED_PACKAGE_TYPES = ["basic", "standard", "premium"];

// Protect this route so only authenticated users can create requests
export const POST = withAuth(
  async (req: NextRequest, { user }: AuthenticatedContext) => {
    console.log(
      `Authenticated user: ${user.email} is creating a new service request.`,
    );
    try {
      const body = await req.json();
      const { serviceName, packageType, price } = body;

      // 1. Enhanced Validation
      if (!serviceName || !packageType || price == null) {
        return NextResponse.json(
          {
            error:
              "Missing required fields: serviceName, packageType, and price are required.",
          },
          { status: 400 },
        );
      }

      // Validate packageType
      if (!ALLOWED_PACKAGE_TYPES.includes(packageType)) {
        return NextResponse.json(
          {
            error: `Invalid packageType. Must be one of: ${ALLOWED_PACKAGE_TYPES.join(", ")}.`,
          },
          { status: 400 },
        );
      }

      // Validate price
      if (typeof price !== "number" || price <= 0) {
        return NextResponse.json(
          { error: "Invalid price. Must be a positive number." },
          { status: 400 },
        );
      }

      await dbConnect();

      // 2. Create the new service request
      const newServiceRequest = await ServiceRequest.create({
        clientId: user.id,
        clientEmail: user.email || "",
        serviceName,
        packageType,
        price,
        status: "pending_payment",
        progress: 0,
        milestones: [
          { label: "Onboarding", completed: false },
          { label: "Design", completed: false },
          { label: "Development", completed: false },
          { label: "Delivery", completed: false },
        ],
      });

      return NextResponse.json(newServiceRequest, { status: 201 });
    } catch (error) {
      console.error("Failed to create service request:", error);
      return NextResponse.json(
        { error: "Internal Server Error: Failed to create service request." },
        { status: 500 },
      );
    }
  },
);
