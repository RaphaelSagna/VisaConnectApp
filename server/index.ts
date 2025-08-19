import express, { Express, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { Firestore } from 'firebase-admin/firestore';
import { Auth } from 'firebase-admin/auth';
// Database connection
import pool from './db/config';
// Register API routes
import authApi from './api/auth';

// Initialize Firebase Admin SDK
let serviceAccount: ServiceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Production: Use environment variable
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Development: Use local file
  try {
    serviceAccount = require('./firebaseServiceAccount.json');
  } catch (error) {
    console.error(
      'Firebase service account not found. Please set FIREBASE_SERVICE_ACCOUNT environment variable or add firebaseServiceAccount.json'
    );
    process.exit(1);
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app: Express = express();
const PORT = process.env.PORT || 8080;

// Test database connection
pool
  .query('SELECT NOW()')
  .then(() => {
    console.log('✅ PostgreSQL database connected successfully');
  })
  .catch((err) => {
    console.error('❌ PostgreSQL database connection failed:', err.message);
  });

// Middleware setup
app.use(express.json()); // For parsing JSON bodies
app.use(cors()); // Enable CORS for all routes

// Health check endpoint
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    // Test database connection
    const dbResult = await pool.query(
      'SELECT NOW() as timestamp, version() as version'
    );

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        firebase: 'initialized',
        server: 'running',
      },
      database: {
        timestamp: dbResult.rows[0].timestamp,
        version: dbResult.rows[0].version.split(' ')[1], // Extract version number
      },
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      services: {
        database: 'disconnected',
        firebase: 'initialized',
        server: 'running',
      },
    });
  }
});

// Register API routes
authApi(app);

// Only serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app build FIRST
  const buildPath = path.join(__dirname, '../../build');
  console.log('Serving static files from:', buildPath);

  // Add cache-busting headers for static assets
  app.use(
    express.static(buildPath, {
      setHeaders: (res, path) => {
        if (path.endsWith('.js') || path.endsWith('.css')) {
          // Cache static assets for 1 year with cache busting
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (path.endsWith('.html')) {
          // Don't cache HTML files
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        }
      },
    })
  );

  // Serve React app for all other routes LAST (after static files)
  app.get('*', (req: Request, res: Response) => {
    const indexPath = path.join(buildPath, 'index.html');
    console.log('Serving index.html from:', indexPath);
    // Add no-cache headers for HTML files
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(indexPath);
  });
} else {
  console.log('Development mode: Static file serving disabled');
}

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    pool.end();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    pool.end();
    process.exit(0);
  });
});
