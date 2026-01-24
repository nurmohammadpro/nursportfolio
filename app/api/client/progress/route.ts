import { adminDb } from "@/app/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }
  try {
    // Fetching all services belogs to this client
    const snapshot = await adminDb
      .collection("service_requests")
      .where("clientId", "==", "userId")
      .get();

    const services = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data }));

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 },
    );
  }
}
