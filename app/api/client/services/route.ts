//app/api/client/services/route.ts
import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse, NextRequest } from "next/server";
import { withAuth, AuthenticatedContext } from "@/app/lib/auth-middleware";
import { ServiceRequest } from "@/app/lib/service-types"; // Import the shared type

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
        // Check for null/undefined for price
        return NextResponse.json(
          {
            error:
              "Missing required fields: serviceName, packageType, and price are required.",
          },
          { status: 400 },
        );
      }

      // Validate packageType is one of the allowed values
      if (!ALLOWED_PACKAGE_TYPES.includes(packageType)) {
        return NextResponse.json(
          {
            error: `Invalid packageType. Must be one of: ${ALLOWED_PACKAGE_TYPES.join(", ")}.`,
          },
          { status: 400 },
        );
      }

      // Validate price is a positive number
      if (typeof price !== "number" || price <= 0) {
        return NextResponse.json(
          { error: "Invalid price. Must be a positive number." },
          { status: 400 },
        );
      }

      // 2. Create the new service request object
      const newServiceRef = adminDb.collection("service_requests").doc();
      const newServiceData: Omit<ServiceRequest, "id" | "updatedAt"> = {
        clientId: user.uid, // Get ID from authenticated user
        clientEmail: user.email || "", // Get email from authenticated user
        serviceName,
        packageType, // This is now validated
        price, // This is now validated
        status: "pending_payment",
        progress: 0,
        milestones: [
          { label: "Onboarding", completed: false },
          { label: "Design", completed: false },
          { label: "Development", completed: false },
          { label: "Delivery", completed: false },
        ],
        createdAt: new Date().toISOString(),
      };

      // 3. Save to Firestore
      await newServiceRef.set({ id: newServiceRef.id, ...newServiceData });

      // 4. Return the complete, created object for consistency
      const createdServiceRequest: ServiceRequest = {
        id: newServiceRef.id,
        ...newServiceData,
      };

      return NextResponse.json(createdServiceRequest, { status: 201 });
    } catch (error) {
      console.error("Failed to create service request:", error);
      return NextResponse.json(
        { error: "Internal Server Error: Failed to create service request." },
        { status: 500 },
      );
    }
  },
);
