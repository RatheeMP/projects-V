import { NextResponse } from "next/server"
import { seedUsers } from "@/lib/seed-users"
import { seedPosts } from "@/lib/seed-posts"

export async function GET() {
  try {
    // Seed users first
    await seedUsers()

    // Then seed posts (which depend on users)
    await seedPosts()

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      note: "You can now sign in with any of the authorized emails",
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed database",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
