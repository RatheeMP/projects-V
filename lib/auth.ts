import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import { redirect } from "next/navigation"

// Define our allowed users
const allowedEmails = [
  "user1@example.com",
  "user2@example.com",
  "user3@example.com",
  "user4@example.com",
  "user5@example.com",
]

export type User = {
  id: string
  name: string
  email: string
  username?: string
  image?: string
}

// Set a cookie with the user's email
export function setUserCookie(email: string) {
  cookies().set("user-email", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })
}

// Clear the user cookie
export function clearUserCookie() {
  cookies().delete("user-email")
}

// Get the current user from the cookie
export async function getCurrentUser(): Promise<User | null> {
  const email = cookies().get("user-email")?.value

  if (!email) {
    return null
  }

  try {
    // Find user by email
    const users = await sql`SELECT * FROM "User" WHERE email = ${email}`

    if (users.length === 0) {
      return null
    }

    const user = users[0]
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      image: user.image,
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Check if the user is authenticated
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  return user
}

// Check if an email is allowed
export function isAllowedEmail(email: string) {
  return allowedEmails.includes(email)
}

// Create a user if they don't exist
export async function createUserIfNotExists(email: string) {
  try {
    // Check if user exists
    const users = await sql`SELECT * FROM "User" WHERE email = ${email}`

    if (users.length > 0) {
      return users[0]
    }

    // Create user
    const id = Math.random().toString(36).substring(2, 15)
    const username = email.split("@")[0]
    const name = username

    await sql`
      INSERT INTO "User" (id, name, email, username, "createdAt", "updatedAt")
      VALUES (${id}, ${name}, ${email}, ${username}, NOW(), NOW())
    `

    return {
      id,
      name,
      email,
      username,
    }
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}
