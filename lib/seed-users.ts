import { sql } from "./db"
import { generateId } from "./db"

// The list of authorized users
export const authorizedUsers = [
  {
    email: "user1@example.com",
    name: "User One",
    username: "user1",
    bio: "First authorized user",
  },
  {
    email: "user2@example.com",
    name: "User Two",
    username: "user2",
    bio: "Second authorized user",
  },
  {
    email: "user3@example.com",
    name: "User Three",
    username: "user3",
    bio: "Third authorized user",
  },
  {
    email: "user4@example.com",
    name: "User Four",
    username: "user4",
    bio: "Fourth authorized user",
  },
  {
    email: "user5@example.com",
    name: "User Five",
    username: "user5",
    bio: "Fifth authorized user",
  },
]

export async function seedUsers() {
  try {
    // Check if users already exist
    const existingUsers = await sql`SELECT email FROM "User" WHERE email IN (${authorizedUsers.map((u) => u.email)})`

    const existingEmails = new Set(existingUsers.map((u: any) => u.email))

    // Filter out users that already exist
    const usersToCreate = authorizedUsers.filter((user) => !existingEmails.has(user.email))

    if (usersToCreate.length === 0) {
      console.log("All authorized users already exist")
      return
    }

    // Insert new users
    for (const user of usersToCreate) {
      await sql`
        INSERT INTO "User" (id, name, email, username, bio, "createdAt", "updatedAt")
        VALUES (${generateId()}, ${user.name}, ${user.email}, ${user.username}, ${user.bio}, NOW(), NOW())
      `
    }

    console.log(`Created ${usersToCreate.length} new users`)
  } catch (error) {
    console.error("Error seeding users:", error)
  }
}
