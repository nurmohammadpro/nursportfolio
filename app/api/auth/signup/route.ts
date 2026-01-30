import { adminAuth } from "@/app/lib/firebase-admin"; // Ensure your admin config is exported as adminAuth
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 },
      );
    }

    // 1. Create the user in Firebase Authentication
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Role Assignment Logic
    // Since you are 'nurprodev@gmail.com', we grant admin status automatically
    let role = "client";
    if (email === "nurprodev@gmail.com") {
      role = "admin";
    }

    await adminAuth.setCustomUserClaims(userRecord.uid, { role });

    return NextResponse.json(
      {
        message: `User created successfully as ${role}`,
        uid: userRecord.uid,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
