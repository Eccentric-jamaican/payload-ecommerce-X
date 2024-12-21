import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define the routes that require authentication
const protectedRoutes = ["/dashboard", "/profile", "/settings", "/account"];

export function middleware(request: NextRequest) {
  // Check if the current path is in the protectedRoutes
  if (
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    // Check for the presence of the 'payload-token' cookie
    const token = request.cookies.get("payload-token");

    // If the token doesn't exist, redirect to the home page
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // If the token exists or the route is not protected, allow the request to proceed
  return NextResponse.next();
}

// Configure the middleware to run only on specific routes
export const config = {
  matcher: [
    "/profile/:path*",
    "/settings/:path*",
    "/dashboard/:path*",
    "/account/:path*",
  ],
};
