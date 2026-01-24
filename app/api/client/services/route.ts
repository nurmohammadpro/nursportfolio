import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { userId, userEmail, serviceName, packageType, price } = body;

    // Validation
    if (!userId || !userEmail || !serviceName || !packageType || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Creating service request
    const newService = {
      clientId: userId,
      clientEmail: userEmail,
      serviceName,
      packageType: [
        { label: "Basic", value: "basic" },
        { label: "Standard", value: "standard" },
        { label: "Premium", value: "premium" },
      ],
      price,
      status: "pending_payment",
      progress: 0,
      milestones: [
        { label: "Onboarding", comleted: false },
        { label: "Design", completed: false },
        { label: "Development", completed: false },
        { label: "Delivery", completed: false },
      ],
      createdAt: new Date().toISOString(),
    };

    // Saving to firestore
    const docRef = await adminDb.collection("service_requests").add(newService);

    return NextResponse.json(
      { success: true, requestId: docRef.id },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create service request" },
      { status: 500 },
    );
  }
}
