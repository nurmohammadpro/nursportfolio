//app/api/admin/monitor/route.ts
import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse, NextRequest } from "next/server";
import { withAuth } from "@/app/lib/auth-middleware";
import { ServiceRequest } from "@/app/lib/service-types";

export const GET = withAuth(async (req: NextRequest, { user }) => {
  console.log(`Admin ${user.email} is accessing the monitor.`);
  try {
    const snapshot = await adminDb
      .collection("service_requests")
      .orderBy("createdAt", "desc")
      .get();

    const data: ServiceRequest[] = snapshot.docs.map(
      (doc: any) => doc.data() as ServiceRequest,
    );

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch monitor data:", error);
    return NextResponse.json(
      { error: "Failed to fetch monitor data" },
      { status: 500 },
    );
  }
});
