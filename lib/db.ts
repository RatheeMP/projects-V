import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Create a SQL client with the Neon connection
export const sql = neon(process.env.DATABASE_URL!)

// Create a Drizzle client
export const db = drizzle(sql)

// Helper function to generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
