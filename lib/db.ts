import { MongoClient, type Db, type Collection } from "mongodb"

let client: MongoClient | null = null
let db: Db | null = null

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

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.DATABASE_URL!)
    await client.connect()
    db = client.db()
    console.log("[v0] Connected to MongoDB")
  }
  return { client, db: db! }
}

export async function getCollection(name: string): Promise<Collection> {
  const { db } = await connectToDatabase()
  return db.collection(name)
}

export async function testConnection() {
  const { db } = await connectToDatabase()
  await db.admin().ping()
  return true
}
