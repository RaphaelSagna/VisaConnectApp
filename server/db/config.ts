import { Pool, PoolConfig } from 'pg';

// Database configuration
let dbConfig: PoolConfig;

if (process.env.DATABASE_URL) {
  // Production: Use Heroku DATABASE_URL
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Heroku
    },
    // Connection pool settings
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  };
} else {
  // Development: Use local environment variables
  dbConfig = {
    user: process.env.DB_USER || 'arronlinton',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'visaconnect',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '5431'),
    // Connection pool settings
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  };
}

// Create connection pool
const pool = new Pool(dbConfig);

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
