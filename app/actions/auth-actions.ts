"use server"

import { setUserCookie, clearUserCookie, isAllowedEmail, createUserIfNotExists } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return {
      success: false,
      message: "Email is required",
    }
  }

  if (!isAllowedEmail(email)) {
    return {
      success: false,
      message: "This email is not authorized to use this application",
    }
  }

  try {
    // Create user if they don't exist
    await createUserIfNotExists(email)

    // Set the user cookie
    setUserCookie(email)

    return {
      success: true,
      message: "Signed in successfully",
    }
  } catch (error) {
    console.error("Error signing in:", error)
    return {
      success: false,
      message: "An error occurred while signing in",
    }
  }
}

export async function signOut() {
  clearUserCookie()
  redirect("/")
}
