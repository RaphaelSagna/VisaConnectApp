"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isAuthenticated_1 = __importDefault(require("../middleware/isAuthenticated"));
const userApi = (app, adminApp, db, auth) => {
    app.post('/api/login', async (req, res) => {
        const { email, password } = req.body;
        // Validate required fields
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: 'Email and password are required.' });
        }
        try {
            // Get user by email
            const userRecord = await auth.getUserByEmail(email);
            // Note: Firebase Admin SDK cannot verify passwords directly
            // In a real implementation, you would use Firebase Auth REST API or client SDK
            // For now, we'll assume the user exists and generate a token
            // TODO: Implement proper password verification
            // Get user data from Firestore
            const userDoc = await db.collection('users').doc(userRecord.uid).get();
            if (!userDoc.exists) {
                return res.status(404).json({ error: 'User profile not found.' });
            }
            const userData = userDoc.data();
            // Generate a custom token
            const customToken = await auth.createCustomToken(userRecord.uid);
            res.json({
                uid: userRecord.uid,
                email: userRecord.email,
                token: customToken,
                userData: {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    location: userData.location,
                    visaType: userData.visaType,
                    employer: userData.employer,
                    job: userData.job,
                },
            });
        }
        catch (error) {
            if (error.code === 'auth/user-not-found') {
                res.status(401).json({ error: 'Invalid email or password.' });
            }
            else {
                res.status(500).json({ error: error.message });
            }
        }
    });
    app.post('/api/register', async (req, res) => {
        console.log('Register endpoint called with body:', req.body);
        const { uid, firstName, lastName, email, location, visaType, employer, job, } = req.body;
        // Validate required fields
        if (!uid || !firstName || !lastName || !email || !location || !visaType) {
            console.log('Missing required fields:', {
                uid,
                firstName,
                lastName,
                email,
                location,
                visaType,
            });
            return res.status(400).json({ error: 'Missing required fields.' });
        }
        try {
            // Temporarily skip Firestore operations
            console.log('Skipping Firestore operations for now...');
            // TODO: Re-enable Firestore operations when database is set up
            // Store user profile in Firestore
            // await db
            //   .collection('users')
            //   .doc(uid)
            //   .set({
            //     firstName,
            //     lastName,
            //     email,
            //     location,
            //     visaType,
            //     employer: employer || '',
            //     job: job || '',
            //     createdAt: adminApp.firestore.FieldValue.serverTimestamp(),
            //   });
            //
            // // Initialize subcollections with default values (if not already present)
            // const userRef = db.collection('users').doc(uid);
            // ... subcollection initialization code ...
            res.status(201).json({ success: true });
        }
        catch (error) {
            console.error('Error in register endpoint:', error);
            res.status(500).json({ error: error.message });
        }
    });
    // All routes below require authentication
    app.use('/api', (0, isAuthenticated_1.default)(auth));
    // Update background_identity subcollection
    app.patch('/api/user/:uid/background_identity', async (req, res) => {
        const { uid } = req.params;
        const data = req.body;
        try {
            await db
                .collection('users')
                .doc(uid)
                .collection('profileAnswers')
                .doc('background_identity')
                .update(data);
            const updatedDoc = await db
                .collection('users')
                .doc(uid)
                .collection('profileAnswers')
                .doc('background_identity')
                .get();
            res.json({ success: true, data: updatedDoc.data() });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    // Update lifestyle_personality subcollection
    app.patch('/api/user/:uid/lifestyle_personality', async (req, res) => {
        const { uid } = req.params;
        const data = req.body;
        try {
            await db
                .collection('users')
                .doc(uid)
                .collection('profileAnswers')
                .doc('lifestyle_personality')
                .update(data);
            const updatedDoc = await db
                .collection('users')
                .doc(uid)
                .collection('profileAnswers')
                .doc('lifestyle_personality')
                .get();
            res.json({ success: true, data: updatedDoc.data() });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    // Update travel_exploration subcollection
    app.patch('/api/user/:uid/travel_exploration', async (req, res) => {
        const { uid } = req.params;
        const data = req.body;
        try {
            await db
                .collection('users')
                .doc(uid)
                .collection('profileAnswers')
                .doc('travel_exploration')
                .update(data);
            const updatedDoc = await db
                .collection('users')
                .doc(uid)
                .collection('profileAnswers')
                .doc('travel_exploration')
                .get();
            res.json({ success: true, data: updatedDoc.data() });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    // Update knowledge_community subcollection
    app.patch('/api/user/:uid/knowledge_community', async (req, res) => {
        const { uid } = req.params;
        const data = req.body;
        try {
            await db
                .collection('users')
                .doc(uid)
                .collection('profileAnswers')
                .doc('knowledge_community')
                .update(data);
            const updatedDoc = await db
                .collection('users')
                .doc(uid)
                .collection('profileAnswers')
                .doc('knowledge_community')
                .get();
            res.json({ success: true, data: updatedDoc.data() });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    // Get user profile by uid (with subcollections)
    app.get('/api/user/:uid/profile', async (req, res) => {
        const { uid } = req.params;
        try {
            const userDoc = await db.collection('users').doc(uid).get();
            if (!userDoc.exists) {
                return res.status(404).json({ error: 'User profile not found.' });
            }
            // Fetch subcollections
            const subcollections = [
                'background_identity',
                'lifestyle_personality',
                'travel_exploration',
                'knowledge_community',
            ];
            const profileAnswers = {};
            for (const sub of subcollections) {
                const subDoc = await db
                    .collection('users')
                    .doc(uid)
                    .collection('profileAnswers')
                    .doc(sub)
                    .get();
                profileAnswers[sub] = subDoc.exists ? subDoc.data() : null;
            }
            res.json({ uid, ...userDoc.data(), profileAnswers });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};
exports.default = userApi;
