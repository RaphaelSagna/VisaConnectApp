const express = require('express');
const path = require('path');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebaseServiceAccount.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
const auth = admin.auth();
console.log('Firebase Admin initialized');

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for API routes
app.use('/api', cors());
app.use(express.json()); // For parsing JSON bodies

// Example API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Register user API routes
require('./api/user')(app, admin, db, auth);

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, '../build')));

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
