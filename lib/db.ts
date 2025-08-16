import { neon } from "@neondatabase/serverless"

if (typeof window === "undefined") {
  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV === "development") {
      console.error("[v0] DATABASE_URL environment variable is not set. Please check your .env.local file.")
    } else {
      console.warn("[v0] DATABASE_URL environment variable is not set")
    }
    throw new Error("DATABASE_URL environment variable is required")
  } else {
    console.log("[v0] Database URL configured:", process.env.DATABASE_URL ? "✓" : "✗")
  }
}

const sql = neon(process.env.DATABASE_URL!)

export { sql }
