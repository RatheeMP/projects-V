import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuthenticated = !!token

  // Define protected routes
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/feed") ||
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/settings") ||
    request.nextUrl.pathname.startsWith("/messages") ||
    request.nextUrl.pathname.startsWith("/notifications") ||
    request.nextUrl.pathname.startsWith("/explore")

  // Redirect unauthenticated users to sign in
  if (!isAuthenticated && isProtectedRoute) {
    const signInUrl = new URL("/signin", request.url)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect authenticated users trying to access sign-in or sign-up to feed
  if (
    isAuthenticated &&
    (request.nextUrl.pathname === "/signin" ||
      request.nextUrl.pathname === "/signup" ||
      request.nextUrl.pathname === "/")
  ) {
    const feedUrl = new URL("/feed", request.url)
    return NextResponse.redirect(feedUrl)
  }

  return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    "/",
    "/signin",
    "/signup",
    "/feed/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/messages/:path*",
    "/notifications/:path*",
    "/explore/:path*",
  ],
}
