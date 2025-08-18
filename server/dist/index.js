"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
// Register user API routes
const user_1 = __importDefault(require("./api/user"));
// Initialize Firebase Admin SDK
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Production: Use environment variable
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
}
else {
    // Development: Use local file
    try {
        serviceAccount = require('./firebaseServiceAccount.json');
    }
    catch (error) {
        console.error('Firebase service account not found. Please set FIREBASE_SERVICE_ACCOUNT environment variable or add firebaseServiceAccount.json');
        process.exit(1);
    }
}
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
});
const db = firebase_admin_1.default.firestore();
const auth = firebase_admin_1.default.auth();
console.log('Firebase Admin initialized');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// Middleware setup
app.use(express_1.default.json()); // For parsing JSON bodies
app.use((0, cors_1.default)()); // Enable CORS for all routes
// Example API route
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});
(0, user_1.default)(app, firebase_admin_1.default, db, auth);
// Serve static files from the React app build FIRST
const buildPath = path_1.default.join(__dirname, '../../build');
console.log('Serving static files from:', buildPath);
app.use(express_1.default.static(buildPath));
// Serve React app for all other routes LAST (after static files)
app.get('*', (req, res) => {
    const indexPath = path_1.default.join(buildPath, 'index.html');
    console.log('Serving index.html from:', indexPath);
    res.sendFile(indexPath);
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
