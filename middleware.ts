// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes - no authentication needed
  const publicRoutes = [
    "/api/auth",
    "/api/jobs", // GET only
  ];

  // Check if route is public
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    // Allow GET requests to /api/jobs without auth
    if (pathname.startsWith("/api/jobs") && request.method === "GET" && pathname === "/api/jobs") {
      return NextResponse.next();
    }
    if (pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }
  }

  // Check authentication for all other API routes
  if (pathname.startsWith("/api")) {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Admin-only routes
    if (pathname.startsWith("/api/admin")) {
      // Admin check will be done in the route handler
      // as we need to query the database for user roles
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};