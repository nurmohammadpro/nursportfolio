import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  return NextResponse.json({
    role: (session?.user as any)?.role || "No Role Found",
    email: session?.user?.email,
    id: (session?.user as any)?.id
  });
}