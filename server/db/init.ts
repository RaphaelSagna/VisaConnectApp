import pool from './config';
import fs from 'fs';
import path from 'path';

async function initializeDatabase() {
  try {
    console.log('Initializing database...');

    // Read the SQL initialization script
    const sqlPath = path.join(__dirname, 'init.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL script
    await pool.query(sqlScript);

    console.log('Database initialized successfully!');
    console.log('Users table created with all necessary indexes and triggers.');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

async function closeConnection() {
  await pool.end();
  console.log('Database connection closed.');
}

// Run initialization if this file is executed directly
if (require.main === module) {
  (async () => {
    try {
      await testConnection();
      await initializeDatabase();
    } catch (error) {
      console.error('Initialization failed:', error);
      process.exit(1);
    } finally {
      await closeConnection();
    }
  })();
}

export { initializeDatabase, testConnection, closeConnection };
