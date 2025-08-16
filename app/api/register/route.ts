// app/api/register/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Registration attempt started")
    const { name, email, password } = await request.json()
    
    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" }, 
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // Test database connection
    try {
      await sql`SELECT 1 as test`
    } catch (dbError) {
      console.error("[v0] Database connection failed:", dbError)
      return NextResponse.json(
        { success: false, message: "Database connection failed" }, 
        { status: 500 }
      )
    }

    // Check for existing user
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase().trim()}
    `

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 } // 409 Conflict
      )
    }

    // Create new user
    const hashedPassword = await hashPassword(password)
    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name.trim()}, ${email.toLowerCase().trim()}, ${hashedPassword})
    `

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
    }, { status: 201 }) // 201 Created

  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
