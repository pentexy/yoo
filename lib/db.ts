import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

console.log("[v0] Database URL configured:", process.env.DATABASE_URL ? "✓" : "✗")

const sql = neon(process.env.DATABASE_URL!)

export { sql }
