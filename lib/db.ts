import { Pool } from "pg";
import fs from "fs";
import path from "path";

// Debugging
if (typeof window === "undefined" && !process.env.DATABASE_URL) {
  console.error(
    process.env.NODE_ENV === "production"
      ? "❌ DATABASE_URL is required in production"
      : "⚠️ DATABASE_URL missing. Check .env.local"
  );
  throw new Error("Database connection URL not configured");
}

// SSL configuration
const sslConfig = (() => {
  // Local development (no SSL)
  if (process.env.NODE_ENV === "development" && 
      !process.env.DATABASE_URL?.includes("supabase") &&
      !process.env.DATABASE_URL?.includes("aws")) {
    return false;
  }

  // Cloud providers that need SSL but accept self-signed
  if (process.env.DATABASE_URL?.match(/supabase|neon|vercel|railway|aws/i)) {
    return { rejectUnauthorized: false };
  }

  // Production with custom CA
  if (process.env.DB_CA_PATH) {
    return {
      ca: fs.readFileSync(path.resolve(process.env.DB_CA_PATH)).toString(),
      rejectUnauthorized: true
    };
  }

  // Default production (strict SSL)
  return { rejectUnauthorized: true };
})();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
  connectionTimeoutMillis: 5000, // 5s timeout
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  max: 20, // Max connections
});

// Health check
(async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection failed", err);
    process.exit(1); // Crash the app if DB is unreachable
  }
})();

// Tagged template literal helper
export const sql = (strings: TemplateStringsArray, ...values: any[]) => {
  let query = strings[0];
  for (let i = 0; i < values.length; i++) {
    query += `$${i + 1}${strings[i + 1]}`;
  }
  return pool.query(query, values);
};

// Graceful shutdown
process.on("SIGTERM", async () => {
  await pool.end();
  console.log("Database pool closed");
});
