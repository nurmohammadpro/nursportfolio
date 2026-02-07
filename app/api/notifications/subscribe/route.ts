import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Subscription from "@/app/models/Subscription";

export async function POST(req: Request) {
  try {
    const subscription = await req.json();

    await dbConnect();

    // We save it as 'nur_mobile' so the webhook knows exactly who to notify
    await Subscription.findOneAndUpdate(
      { deviceId: "nur_mobile" },
      { ...subscription, deviceId: "nur_mobile" },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
