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
  const isAuthPage =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");

  if (!session && (isAdminRoute || isDashboardRoute)) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Optional: If they ARE logged in, don't let them go back to signin
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/admin/monitor", request.url));
  }

  return NextResponse.next();
}

// Ensure the matcher is outside the function
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
