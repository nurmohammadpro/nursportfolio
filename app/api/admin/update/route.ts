import { adminDb } from "@/app/lib/firebase-admin";
import { stat } from "fs";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const { requestId, progress, status } = await req.json();

    await adminDb
      .collection("service_requests")
      .doc(requestId)
      .update({ progress, stat, updatedAt: new Date() });

    return NextResponse.json({ message: "Update successful" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
