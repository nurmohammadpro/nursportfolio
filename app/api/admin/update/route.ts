//app/api/admin/update/route.ts
import { withAuth } from "@/app/lib/auth-middleware";
import { adminDb } from "@/app/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = withAuth(async (req: NextRequest, { user }) => {
  console.log(`Admin ${user.email} is updating a service request`);
  try {
    const { requestId, progress, status } = await req.json();
    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 },
      );
    }

    const updateData: {
      progress?: number;
      status?: string;
      updatedAt: string;
    } = {
      updatedAt: new Date().toISOString(),
    };

    if (progress !== undefined) {
      updateData.progress = progress;
    }
    if (status !== undefined) {
      updateData.status = status;
    }

    await adminDb
      .collection("service_requests")
      .doc(requestId)
      .update(updateData);

    return NextResponse.json({ message: "Update successful" }, { status: 200 });
  } catch (error) {
    console.error("Failed to update service request:", error);
    return NextResponse.json(
      { error: "Internal Server Error: Could not update service request." },
      { status: 500 },
    );
  }
});
