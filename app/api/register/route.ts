import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Registration attempt started")
    const { name, email, password } = await request.json()
    console.log("[v0] Request data received:", { name, email, passwordLength: password?.length })

    // Validate input
    if (!name || !email || !password) {
      console.log("[v0] Validation failed: missing fields")
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 })
    }

    console.log("[v0] Testing database connection...")
    try {
      await sql`SELECT 1 as test`
      console.log("[v0] Database connection successful")
    } catch (dbError) {
      console.error("[v0] Database connection failed:", dbError)
      return NextResponse.json({ success: false, message: "Database connection failed" }, { status: 500 })
    }

    // Check if user already exists
    console.log("[v0] Checking if user exists...")
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `
    console.log("[v0] Existing user check result:", existingUser.length)

    if (existingUser.length > 0) {
      console.log("[v0] User already exists")
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 })
    }

    // Hash password
    console.log("[v0] Hashing password...")
    const hashedPassword = await hashPassword(password)
    console.log("[v0] Password hashed successfully")

    // Create user
    console.log("[v0] Creating user in database...")
    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `
    console.log("[v0] User created successfully")

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
    })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
