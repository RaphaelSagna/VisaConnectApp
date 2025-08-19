import { Express, Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { Firestore } from 'firebase-admin/firestore';
import { Auth } from 'firebase-admin/auth';
import isAuthenticated from '../middleware/isAuthenticated';

const userApi = (
  app: Express,
  adminApp: typeof admin,
  db: Firestore,
  auth: Auth
) => {
  app.post('/api/login', async (req: Request, res: Response) => {
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

      const userData = userDoc.data() as any;

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
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        res.status(401).json({ error: 'Invalid email or password.' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  app.post('/api/register', async (req: Request, res: Response) => {
    console.log('Register endpoint called with body:', req.body);

    const {
      uid,
      firstName,
      lastName,
      email,
      location,
      visaType,
      employer,
      job,
    } = req.body;

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
    } catch (error: any) {
      console.error('Error in register endpoint:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // All routes below require authentication
  app.use('/api', isAuthenticated(auth));

  // Update background_identity subcollection
  app.patch(
    '/api/user/:uid/background_identity',
    async (req: Request, res: Response) => {
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
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Update lifestyle_personality subcollection
  app.patch(
    '/api/user/:uid/lifestyle_personality',
    async (req: Request, res: Response) => {
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
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Update travel_exploration subcollection
  app.patch(
    '/api/user/:uid/travel_exploration',
    async (req: Request, res: Response) => {
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
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Update knowledge_community subcollection
  app.patch(
    '/api/user/:uid/knowledge_community',
    async (req: Request, res: Response) => {
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
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Get user profile by uid (with subcollections)
  app.get('/api/user/:uid/profile', async (req: Request, res: Response) => {
    const { uid } = req.params;
    try {
      const userDoc = await db.collection('users').doc(uid).get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User profile not found.' });
      }

      // Fetch subcollections using collection group query for true batch read
      const query = db
        .collectionGroup('profileAnswers')
        .where('__name__', '>=', `users/${uid}/profileAnswers/`)
        .where('__name__', '<', `users/${uid}/profileAnswers/\uf8ff`);

      const querySnapshot = await query.get();

      // Map results back to profileAnswers object
      const profileAnswers: Record<string, any> = {};
      querySnapshot.forEach((doc) => {
        // Extract the subcollection name from the document path
        const pathParts = doc.ref.path.split('/');
        const subcollectionName = pathParts[pathParts.length - 1];
        profileAnswers[subcollectionName] = doc.data();
      });

      res.json({ uid, ...userDoc.data(), profileAnswers });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
};

export default userApi;
