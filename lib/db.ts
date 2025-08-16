import { Pool } from "pg";
import fs from "fs";
import path from "path";

// ======================
// AIVEN-SPECIFIC CONFIG
// ======================
const AIVEN_CA_CERT = `
-----BEGIN CERTIFICATE-----
MIIESTCCAzGgAwIBAgITBn+UV4WH6KPE33Z59kZFurUkSTANBgkqhkiG9w0BAQsF
ADA5MQswCQYDVQQGEwJOTDEPMA0GA1UEChMGQWl2ZW4xHzAdBgNVBAMTFkFpdmVu
IFJvb3QgQ0EgMjAyMS0yMDIwHhcNMjEwNTI2MDAwMDAwWhcNMzEwNTI2MjM1OTU5
WjA5MQswCQYDVQQGEwJOTDEPMA0GA1UEChMGQWl2ZW4xHzAdBgNVBAMTFkFpdmVu
IFJvb3QgQ0EgMjAyMS0yMDIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB
AQDFDEpZFVtrY8IAVwOQ7Qbq3ZzX9QEhGf2R3AvV1/5t1v8N5O9w5J6YdC7Q8FZ
-----END CERTIFICATE-----
`.trim();

// ======================
// DATABASE CONNECTION
// ======================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Your Aiven URL
  ssl: {
    ca: AIVEN_CA_CERT,
    rejectUnauthorized: true // Must be true for Aiven
  },
  // Aiven-optimized settings
  connectionTimeoutMillis: 10000, // 10s connection timeout
  idleTimeoutMillis: 30000, // 30s idle timeout
  max: 8, // Aiven recommends low connection counts
  allowExitOnIdle: true
});

// ======================
// CONNECTION HEALTHCHECK
// ======================
(async () => {
  try {
    const client = await pool.connect();
    try {
      await client.query("SELECT 1");
      console.log("🟢 Aiven PostgreSQL: Connection successful");
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("🔴 Aiven PostgreSQL: Connection failed");
    console.error("Error details:", {
      code: err.code,
      message: err.message,
      stack: err.stack
    });
    
    // Provide Aiven-specific troubleshooting
    if (err.code === 'SELF_SIGNED_CERT_IN_CHAIN') {
      console.log("\n🔧 Aiven SSL Fix Required:");
      console.log("1. Ensure you're using their CA certificate (included above)");
      console.log("2. Verify your connection string includes '?sslmode=require'");
      console.log("3. Check for certificate updates: https://ca.aiven.io/");
    }

    process.exit(1); // Crash app if DB is unreachable
  }
})();

// ======================
// SQL HELPER FUNCTION
// ======================
export const sql = Object.assign(
  (strings: TemplateStringsArray, ...values: any[]) => {
    let query = strings[0];
    for (let i = 0; i < values.length; i++) {
      query += `$${i + 1}${strings[i + 1]}`;
    }
    return pool.query(query, values);
  },
  {
    // Additional helpers
    raw: (text: string) => pool.query(text),
    getClient: () => pool.connect(),
    end: () => pool.end()
  }
);

// ======================
// GRACEFUL SHUTDOWN
// ======================
const shutdown = async () => {
  console.log("🛑 Closing database pool...");
  await pool.end();
  console.log("✅ Database pool closed");
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// ======================
// TYPE EXPORTS
// ======================
export type SqlQuery = ReturnType<typeof sql>;
