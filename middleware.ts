import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js expects a default export or a named 'middleware' export
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Retrieve the session cookie
  // We use cookies because they are accessible in the Edge runtime
  const session = request.cookies.get("session")?.value;

  // 2. Protected Route Logic
  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (!session && (isAdminRoute || isDashboardRoute)) {
    // If no session exists, bounce them to sign-in
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 3. Admin vs Client logic
  // Full JWT verification is handled in the Layouts we built
  // to avoid blocking the Edge runtime with heavy SDKs.

  return NextResponse.next();
}

// Ensure the matcher is outside the function
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
