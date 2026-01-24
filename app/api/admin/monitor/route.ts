import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const snapshot = await adminDb
      .collection("service_request")
      .orderBy("createdAt", "desc")
      .get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch monitor data" },
      { status: 500 },
    );
  }
}
