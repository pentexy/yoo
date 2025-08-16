// lib/db.ts
import { Pool } from "pg";

// ======================
// AIVEN-SPECIFIC CERTIFICATE
// ======================
const AIVEN_CA_CERT = `
-----BEGIN CERTIFICATE-----
MIIEUDCCArigAwIBAgIUXI0fOhe1nMaboLq1VC9nZ0i8okMwDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1NGRjMjlmZGQtZjcxMS00Y2ZlLWIyOTgtMmUxMGE0MWVj
MjQ2IEdFTiAxIFByb2plY3QgQ0EwHhcNMjUwODE2MTcyNTIwWhcNMzUwODE0MTcy
NTIwWjBAMT4wPAYDVQQDDDU0ZGMyOWZkZC1mNzExLTRjZmUtYjI5OC0yZTEwYTQx
ZWMyNDYgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBAN2Kq1h0cvJXgWjx7XJk85ZzC5O3CKxfjIZU723+fVNenFhJrnKczxOk
B3QFqnFgca4l6KqBv2bmimdhruL4LjXrmYIM3daCdWWqVjsxutQn4Owf/iNVc7Ug
yxVtKgPe918GrVnIwSKEWM5s1WJRIreqv4sJFiENiXoX12ZENLLN+yar2DZIFF5+
c7lcJEiTCFlkIYtPFcHvnBpfdrv4y2rRje+hNVqc+fNxX4eDGoP1CvcmgqZNtkWc
J2XU/d+Z1KYdqDwDtpXs20JmGVpvSd2FCzv4shoB2xsVOyGQcBdrULwCL0DEuKiN
cEfVBrJmf9gWhISA8uuaVDxxdJqGXn3I1ZkfVKobH+207fPH81SobeGFE3fz78xH
txPKno6XDfLNfHQ5IhQy1jalcECX7c7K6JmNLMgCDBpFWcJ5A86hg9jheCfDjXxV
21fO7gICwztKX2qkJiM863MVX8mjCUvpLuCm+Lshiogj6yvP9oQ4GrhdwYAzPRqu
Zq7eyg82OQIDAQABo0IwQDAdBgNVHQ4EFgQU4BayNyx7uFm/tlCZOhD188AtSqQw
EgYDVR0TAQH/BAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQAD
ggGBANb84hN+z5jDNWLLYQTRqPoz9K/z96y2mD9eIA1e1liEngWGCpDNteN0cMiM
jU8LBD4koGqmAE3Tm2ZAQvxffap/DtyywFZ/BPx5NRtv7cdd5hkgZkWzg+eR8DMO
soV4KZK0zVIusqUaZXc8gokRDbQw/9yfzPQLDWlP+JpPpeM3Du6wh/vaSUuBIDH0
mpu7me0UeTlqjkJGdBlNttESCYzlj1lotbUtI9eUl2/Gy2IWS2C7Rpzn9AjYKaWf
2FOWKNBrASmFfvkgwPBXmHhclRk5Tvz7ljxdrSN/iN9FVinw3ihTueh0VBep7zpf
vMfcOa7PRwgbcD5g/yPQJiisxCsqV73p+augvp/ijkWjyImFB6LmXdY3QEpggoQP
F0wfgg4eeAXcVPSPdm6PevX4DfAn57Ab2tH9rZuafLR6OJgC7ngrKglv+/ZSCcBC
BdX4DhTtZyhrM0UeYjxff+XSmhxMc6c8cuqL815RTRsFwBpbWd2WyEJQSc+XMSdL
5VBAWQ==
-----END CERTIFICATE-----
`.trim();

// ======================
// DATABASE POOL
// ======================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Aiven PostgreSQL URL
  ssl: {
    ca: AIVEN_CA_CERT,
    rejectUnauthorized: true,
  },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 8,
  allowExitOnIdle: true,
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
  } catch (err: any) {
    console.error("🔴 Aiven PostgreSQL: Connection failed");
    console.error("Error details:", {
      code: err.code,
      message: err.message,
      stack: err.stack
    });

    if (err.code === 'SELF_SIGNED_CERT_IN_CHAIN') {
      console.log("\n🔧 SSL Fix: Ensure you're using Aiven CA certificate.");
    }

    process.exit(1); // crash if DB unreachable
  }
})();

// ======================
// SQL HELPER
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

export type SqlQuery = ReturnType<typeof sql>;
