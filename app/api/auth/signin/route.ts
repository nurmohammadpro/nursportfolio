import { adminAuth } from "@/app/lib/firebase-admin";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!adminAuth) {
      return NextResponse.json(
        { error: "Auth service unavailable" },
        { status: 500 },
      );
    }

    // This operation requires "Firebase Auth Admin" IAM role
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // This operation requires "Service Account Token Creator" IAM role
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    // NEXT.JS 15: Must await cookies()
    const cookieStore = await cookies();
    cookieStore.set("session", sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({
      success: true,
      role: decodedToken.role || "admin",
    });
  } catch (error: any) {
    console.error("SERVER_AUTH_ERROR:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
