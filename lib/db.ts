import { Pool } from "pg";
import fs from "fs";
import path from "path";

// 1. Environment Validation
if (typeof window === "undefined" && !process.env.DATABASE_URL) {
  throw new Error(`
    Database connection failed: DATABASE_URL is missing.
    ${process.env.NODE_ENV === 'development' 
      ? 'Please check your .env.local file' 
      : 'Production requires valid database URL'}
  `);
}

// 2. Smart SSL Configuration
const getSSLConfig = () => {
  // Development: No SSL for local PostgreSQL
  if (process.env.NODE_ENV === 'development' && 
      /localhost|127.0.0.1/.test(process.env.DATABASE_URL || '')) {
    return false;
  }

  // Common cloud providers that need SSL
  const cloudProviders = [
    'supabase',
    'neon',
    'vercel',
    'railway',
    'aws',
    'digitalocean',
    'azure'
  ];

  // Cloud provider detection
  const isCloudProvider = cloudProviders.some(provider => 
    process.env.DATABASE_URL?.includes(provider)
  );

  // Production or cloud: Use SSL with appropriate settings
  return {
    rejectUnauthorized: process.env.NODE_ENV === 'production' && !isCloudProvider,
    ca: process.env.DB_CA_CERT ? 
      fs.readFileSync(path.resolve(process.env.DB_CA_CERT)).toString() : 
      undefined
  };
};

// 3. Database Pool Configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: getSSLConfig(),
  connectionTimeoutMillis: 10000, // 10s connection timeout
  idleTimeoutMillis: 30000, // 30s idle timeout
  max: 15, // Maximum number of connections
});

// 4. Connection Test with Error Handling
(async () => {
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT NOW()');
      console.log('✅ Database connection successful');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    
    // Provide specific troubleshooting tips
    if (error.code === 'SELF_SIGNED_CERT_IN_CHAIN') {
      console.log(`
        SSL Certificate Error Detected:
        1. For cloud providers (Supabase/Neon/etc), add this to your .env:
           DB_SSL_MODE=no-verify
        
        2. For production with custom certificates:
           DB_CA_CERT=path/to/ca-certificate.crt
        
        3. For local development, ensure your DATABASE_URL doesn't force SSL
      `);
    }
    
    // Only exit in production
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

// 5. Enhanced SQL Helper
export const sql = Object.assign(
  (strings: TemplateStringsArray, ...values: any[]) => {
    let query = strings[0];
    for (let i = 0; i < values.length; i++) {
      query += `$${i + 1}${strings[i + 1]}`;
    }
    return pool.query(query, values);
  },
  {
    // Additional helper methods
    raw: (text: string) => pool.query(text),
    transaction: async (queries: Promise<any>[]) => {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const results = await Promise.all(queries);
        await client.query('COMMIT');
        return results;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }
  }
);

// 6. Graceful Shutdown
const shutdown = async () => {
  console.log('Closing database pool...');
  await pool.end();
  console.log('Database pool closed');
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
