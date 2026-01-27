import { withAuth } from "@/app/lib/auth-middleware";
import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse } from "next/server";

export const POST = withAuth(async (req: Request, { user }) => {
  try {
    const body = await req.json();

    const { serviceName, packageType, price } = body;

    //Validation
    if (!serviceName || !packageType || !price) {
      return NextResponse.json(
        { error: "Missing required fields: serviceName, packageType, price" },
        { status: 400 },
      );
    }

    const newServiceRef = adminDb.collection("service_requests").doc();
    // Define ServiceRequest type if not already imported
    type ServiceRequest = {
      id: string;
      clientId: string;
      clientEmail: string;
      serviceName: string;
      packageType: string;
      price: number;
      status: string;
      progress: number;
      milestones: { label: string; completed: boolean }[];
      createdAt: string;
      updatedAt: string;
    };

    const newServiceData: Omit<ServiceRequest, "id" | "updatedAt"> = {
      clientId: user.uid,
      clientEmail: user.email || "",
      serviceName,
      packageType,
      price,
      status: "pending_payment",
      progress: 0,
      milestones: [
        { label: "Onboarding", completed: false }, // FIX: Typo corrected
        { label: "Design", completed: false },
        { label: "Development", completed: false },
        { label: "Delivery", completed: false },
      ],
      createdAt: new Date().toISOString(),
    };

    await newServiceRef.set({ id: newServiceRef.id, ...newServiceData });

    return NextResponse.json(
      { success: true, id: newServiceRef.id },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create service request" },
      { status: 500 },
    );
  }
});
