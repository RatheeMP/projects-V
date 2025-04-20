"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function AuthStatus() {
  const { data: session, status } = useSession()

  return (
    <div className="rounded-md bg-muted p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">
            Status: <span className="font-bold">{status}</span>
          </p>
          {status === "authenticated" && session?.user && (
            <p className="text-sm text-muted-foreground">
              Signed in as {session.user.name} ({session.user.email})
            </p>
          )}
        </div>
        {status === "authenticated" && (
          <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
            Sign out
          </Button>
        )}
      </div>
    </div>
  )
}
