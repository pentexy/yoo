import { Pool } from "pg";

// Check if DATABASE_URL is set (server-side only)
if (typeof window === "undefined") {
  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV === "development") {
      console.error("[v0] DATABASE_URL is missing. Check your .env.local file.");
    } else {
      console.warn("[v0] DATABASE_URL is not set.");
    }
    throw new Error("DATABASE_URL is required.");
  } else {
    console.log("[v0] Database URL configured:", process.env.DATABASE_URL ? "✓" : "✗");
  }
}

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Disable SSL in development, enforce in production (adjust as needed)
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : false,
});

// SQL helper for tagged template literals
export const sql = (strings: TemplateStringsArray, ...values: any[]) => {
  let query = strings[0];
  for (let i = 0; i < values.length; i++) {
    query += `$${i + 1}` + strings[i + 1];
  }
  return pool.query(query, values);
};
