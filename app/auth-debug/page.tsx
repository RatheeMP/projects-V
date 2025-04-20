"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthDebugPage() {
  const { data: session, status } = useSession()

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Debug</CardTitle>
          <CardDescription>Check your authentication status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <p className="font-medium">Status: {status}</p>
            {status === "authenticated" && session?.user && (
              <div className="mt-2">
                <p>User: {session.user.name}</p>
                <p>Email: {session.user.email}</p>
              </div>
            )}
          </div>

          <div className="rounded-md bg-muted p-4">
            <p className="font-medium">Environment:</p>
            <p className="mt-2">NEXTAUTH_URL: {process.env.NEXT_PUBLIC_VERCEL_URL || "Not available client-side"}</p>
          </div>

          <div className="space-y-2">
            <p className="font-medium">Test Authentication:</p>
            <div className="grid gap-2">
              <Button onClick={() => signIn("credentials", { email: "user1@example.com" })}>
                Sign in as user1@example.com
              </Button>
              <Button variant="outline" onClick={() => signOut()}>
                Sign out
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            This page helps diagnose authentication issues. If you're seeing this page, NextAuth.js is properly loaded.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
