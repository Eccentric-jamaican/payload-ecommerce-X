import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/profile",
  "/purchases",
  "wishlist",
  "checkout",
  "/settings",
  "/account",
];

export function middleware(request: NextRequest) {
  if (
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    const token = request.cookies.get("payload-token");

    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/purchases/:path*",
    "/wishlist/:path*",
    "/checkout/:path*",
    "/settings/:path*",
    "/account/:path*",
  ],
};
