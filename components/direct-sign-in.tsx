"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { useState } from "react"

export function DirectSignIn() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("credentials", {
        email: "user1@example.com",
        redirect: true,
        callbackUrl: "/feed",
      })
    } catch (error) {
      console.error("Direct sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleSignIn} disabled={isLoading}>
      {isLoading ? "Signing in..." : "Sign in as user1@example.com"}
    </Button>
  )
}
