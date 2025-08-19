"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
// Database connection
const config_1 = __importDefault(require("./db/config"));
// Initialize Firebase Admin SDK (temporarily disabled for database testing)
// let serviceAccount: ServiceAccount;
// if (process.env.FIREBASE_SERVICE_ACCOUNT) {
//   // Production: Use environment variable
//   serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
// } else {
//   // Development: Use local file
//   try {
//     serviceAccount = require('./firebaseServiceAccount.json');
//   } catch (error) {
//     console.error(
//       'Firebase service account not found. Please set FIREBASE_SERVICE_ACCOUNT environment variable or add firebaseServiceAccount.json'
//       );
//     process.exit(1);
//   }
// }
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
// const db: Firestore = admin.firestore();
// const auth: Auth = admin.auth();
// console.log('Firebase Admin initialized');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// Test database connection
config_1.default
    .query('SELECT NOW()')
    .then(() => {
    console.log('✅ PostgreSQL database connected successfully');
})
    .catch((err) => {
    console.error('❌ PostgreSQL database connection failed:', err.message);
});
// Middleware setup
app.use(express_1.default.json()); // For parsing JSON bodies
app.use((0, cors_1.default)()); // Enable CORS for all routes
// Example API route
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});
// userApi(app, admin, db, auth); // Temporarily disabled for database testing
// Only serve static files in production
if (process.env.NODE_ENV === 'production') {
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
}
else {
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
        config_1.default.end();
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        config_1.default.end();
        process.exit(0);
    });
});
