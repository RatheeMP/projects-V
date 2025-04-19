import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), "lib", "auth", "create-auth-tables.sql")
    const sqlQuery = fs.readFileSync(sqlFilePath, "utf8")

    // Execute the SQL query
    await sql.query(sqlQuery)

    return NextResponse.json({
      success: true,
      message: "Auth tables created successfully",
    })
  } catch (error) {
    console.error("Error setting up auth tables:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to set up auth tables",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
