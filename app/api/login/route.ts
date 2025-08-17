import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { comparePassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const usersCollection = await getCollection("users")
    const user = await usersCollection.findOne({ email })

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Create session record (optional)
    const sessionsCollection = await getCollection("sessions")
    await sessionsCollection.insertOne({
      user_id: user._id,
      login_time: new Date(),
    })

    // Generate JWT token
    const token = generateToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
