import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Check for either authentication method
  const userEmail = request.cookies.get("user-email")?.value
  const nextAuthSession =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value

  const isAuthenticated = !!userEmail || !!nextAuthSession

  // Define protected routes that require authentication
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/feed") ||
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/settings") ||
    request.nextUrl.pathname.startsWith("/messages") ||
    request.nextUrl.pathname.startsWith("/notifications") ||
    request.nextUrl.pathname.startsWith("/explore")

  // Only redirect unauthenticated users away from protected pages
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL("/signin", request.url))
  }

  return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    "/feed/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/messages/:path*",
    "/notifications/:path*",
    "/explore/:path*",
  ],
}
