//app/api/client/progress/route.ts
import { withAuth } from "@/app/lib/auth-middleware";
import { adminDb } from "@/app/lib/firebase-admin";
import { ServiceRequest } from "@/app/lib/service-types";
import { NextRequest, NextResponse } from "next/server";

export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    //Fetching progress data for admin
    const snapshot = await adminDb
      .collection("service_requests")
      .where("clientId", "==", user.uid)
      .orderBy("createdAt", "desc")
      .get();

    const services: ServiceRequest[] = snapshot.docs.map(
      (doc) => doc.data() as ServiceRequest,
    );

    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.error("Error fetching progress data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
});
