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
import serviceAccount from './firebaseServiceAccount.json';
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});
const db: Firestore = admin.firestore();
const auth: Auth = admin.auth();
console.log('Firebase Admin initialized');

const app: Express = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for API routes
app.use('/api', cors());
app.use(express.json()); // For parsing JSON bodies

// Example API route
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the backend!' });
});

userApi(app, admin, db, auth);

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, '../build')));

// Serve React app for all other routes
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
