"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DebugPage() {
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
                <p>ID: {session.user.id}</p>
              </div>
            )}
          </div>

          <div className="rounded-md bg-muted p-4">
            <p className="font-medium">Environment:</p>
            <p className="mt-2">NEXTAUTH_URL: {process.env.NEXT_PUBLIC_VERCEL_URL || "Not available client-side"}</p>
          </div>

          <div className="space-y-2">
            <p className="font-medium">Navigation:</p>
            <div className="grid gap-2">
              <Link href="/feed">
                <Button variant="outline" className="w-full">
                  Go to Feed
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" className="w-full">
                  Go to Profile
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Go to Home
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {status === "authenticated" ? (
            <Button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</Button>
          ) : (
            <Button onClick={() => signIn("credentials", { email: "user1@example.com" })}>
              Sign in as user1@example.com
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
