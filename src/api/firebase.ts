// Lightweight Firebase client initialization for real-time listeners only.
// Writes still go through the backend API.

import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  type Auth,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

type FirebaseClients = {
  appInitialized: boolean;
  auth: Auth | null;
  db: Firestore | null;
};

const clients: FirebaseClients = {
  appInitialized: false,
  auth: null,
  db: null,
};

function getConfig() {
  // Expect REACT_APP_* keys in env; if missing, init will fail and callers should fallback
  const cfg = {
    apiKey: process.env.REACT_APP_FIREBASE_WEB_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };
  // Minimal guard
  if (!cfg.apiKey || !cfg.projectId || !cfg.appId) {
    return null;
  }
  return cfg;
}

export function ensureFirebase(): { db: Firestore; auth: Auth } | null {
  try {
    if (!clients.appInitialized) {
      const config = getConfig();
      if (!config) return null;
      if (getApps().length === 0) {
        initializeApp(config);
      }
      clients.auth = getAuth();
      clients.db = getFirestore();
      clients.appInitialized = true;
    }
    // clients.auth / clients.db must be non-null now
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { db: clients.db!, auth: clients.auth! };
  } catch (_e) {
    return null;
  }
}

// Best-effort anonymous sign-in for read-only listeners
export async function ensureSignedInAnonymously(): Promise<void> {
  const bundle = ensureFirebase();
  if (!bundle) return; // allow callers to fallback
  const { auth } = bundle;
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, async (current) => {
      try {
        if (!current) {
          await signInAnonymously(auth);
        }
      } catch {
        // ignore; callers will fallback
      } finally {
        unsub();
        resolve();
      }
    });
  });
}
