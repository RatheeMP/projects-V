"use client"

import { SignInForm } from "@/components/sign-in-form"
import { useSearchParams } from "next/navigation"

export function SignInFormWrapper() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/feed"

  return <SignInForm callbackUrl={callbackUrl} />
}
