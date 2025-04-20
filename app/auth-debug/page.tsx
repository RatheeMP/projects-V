"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signIn, signOut } from "next-auth/react"
import Link from "next/link"

export default function AuthDebugPage() {
  const { data: session, status } = useSession()

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Debug</CardTitle>
          <CardDescription>Check your authentication status and session details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <p className="font-medium">
              Status: <span className="font-bold">{status}</span>
            </p>
            {status === "authenticated" ? (
              <div className="mt-2 space-y-2">
                <p>
                  User: {session?.user?.name} ({session?.user?.email})
                </p>
                <p>ID: {session?.user?.id}</p>
                <p>Username: {session?.user?.username}</p>
              </div>
            ) : status === "loading" ? (
              <p className="mt-2">Loading session...</p>
            ) : (
              <p className="mt-2">Not authenticated</p>
            )}
          </div>

          <div className="rounded-md bg-muted p-4">
            <p className="font-medium">Environment:</p>
            <p className="mt-2">
              NEXTAUTH_URL is set to: {process.env.NEXT_PUBLIC_VERCEL_URL || "Not available client-side"}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {status === "authenticated" ? (
            <Button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</Button>
          ) : (
            <Button onClick={() => signIn()}>Sign In</Button>
          )}
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
