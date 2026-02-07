import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Retrieve the NextAuth token (this replaces manual cookie check)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthPage =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");
  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // 2. Not logged in -> Redirect to sign-in
  if (!token && (isAdminRoute || isDashboardRoute)) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 3. Admin Protection: Redirect non-admins away from /admin
  if (isAdminRoute && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/client/dashboard", request.url));
  }

  // 4. Already logged in -> Redirect away from Auth pages
  if (token && isAuthPage) {
    const redirectUrl =
      token.role === "ADMIN" ? "/admin/monitor" : "/client/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/signin", "/signup"],
};
