"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or not authorized.")
      } else {
        // Explicitly redirect to the feed page
        router.push("/feed")
        router.refresh()
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setError("There was an error signing in.")
    } finally {
      setIsLoading(false)
    }
  }

  // Test users for easy login
  const testUsers = [
    "user1@example.com",
    "user2@example.com",
    "user3@example.com",
    "user4@example.com",
    "user5@example.com",
  ]

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="user1@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Test Users</span>
          </div>
        </div>

        <div className="grid gap-2">
          {testUsers.map((email) => (
            <Button
              key={email}
              variant="outline"
              size="sm"
              className="justify-start"
              onClick={() => {
                setEmail(email)
                // Submit the form programmatically
                const form = document.querySelector("form")
                if (form) form.dispatchEvent(new Event("submit", { cancelable: true }))
              }}
            >
              {email}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Don't have an account?</span>
        </div>
      </div>
      <Link href="/signup">
        <Button variant="outline" className="w-full">
          Create an account
        </Button>
      </Link>
    </div>
  )
}
