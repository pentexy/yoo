import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Orders GET request started")

    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Get user's orders
    const orders = await db.collection("orders").find({ userId: decoded.userId }).sort({ createdAt: -1 }).toArray()

    // Calculate stats
    const stats = {
      total: orders.length,
      active: orders.filter((o) => o.status === "active").length,
      pending: orders.filter((o) => o.status === "pending").length,
      totalSpent: orders.reduce((sum, order) => sum + (order.price || 0), 0),
    }

    return NextResponse.json({ orders, stats })
  } catch (error) {
    console.error("[v0] Orders GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Orders POST request started")

    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const { service, type, price, billingCycle, serverLocation } = body

    const { db } = await connectToDatabase()

    // Create new order
    const newOrder = {
      userId: decoded.userId,
      id: `ORD-${Date.now()}`,
      service,
      type,
      status: "pending",
      price: Number.parseFloat(price),
      billingCycle,
      serverLocation,
      createdAt: new Date(),
      nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    }

    const result = await db.collection("orders").insertOne(newOrder)

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      orderId: newOrder.id,
    })
  } catch (error) {
    console.error("[v0] Orders POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
