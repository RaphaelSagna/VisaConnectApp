import express, { Express, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { Firestore } from 'firebase-admin/firestore';
import { Auth } from 'firebase-admin/auth';
// Register user API routes
import userApi from './api/user';

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

const db: Firestore = admin.firestore();
const auth: Auth = admin.auth();
console.log('Firebase Admin initialized');

const app: Express = express();
const PORT = process.env.PORT || 8080;

// Middleware setup
app.use(express.json()); // For parsing JSON bodies
app.use(cors()); // Enable CORS for all routes

// Example API route
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the backend!' });
});

userApi(app, admin, db, auth);

// Serve static files from the React app build FIRST
const buildPath = path.join(__dirname, '../../build');
console.log('Serving static files from:', buildPath);
app.use(express.static(buildPath));

// Serve React app for all other routes LAST (after static files)
app.get('*', (req: Request, res: Response) => {
  const indexPath = path.join(buildPath, 'index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
