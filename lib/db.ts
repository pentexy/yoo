import { neon } from "@neondatabase/serverless"

if (typeof window === "undefined" && process.env.NODE_ENV !== "development") {
  if (!process.env.DATABASE_URL) {
    console.warn("[v0] DATABASE_URL environment variable is not set")
  } else {
    console.log("[v0] Database URL configured:", process.env.DATABASE_URL ? "✓" : "✗")
  }
}

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null

export { sql }
