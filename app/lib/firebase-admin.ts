// @/app/lib/firebase-admin.ts

import admin from "firebase-admin";
import { getApps, cert } from "firebase-admin/app";

/**
 * Initializes Firebase Admin SDK.
 * Returns the app instance or null if environment variables are missing.
 */
function getAdminApp() {
  if (getApps().length > 0) {
    return admin.app();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    // During build, environment variables might be missing.
    // We log a warning instead of throwing to allow the build to complete.
    console.warn("Firebase Admin SDK: Missing environment variables. Initialization skipped.");
    return null;
  }

  try {
    // Robust handling of private key newlines
    const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");

    return admin.initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: formattedPrivateKey,
      }),
    });
  } catch (error) {
    console.error("Firebase Admin SDK initialization failed:", error);
    return null;
  }
}

const app = getAdminApp();

// Export the initialized services. 
// If app is null, these will be null. This is safe during build scanning 
// but will (correctly) error at runtime if used without proper env vars.
export const adminDb = app ? admin.firestore() : null as unknown as admin.firestore.Firestore;
export const adminAuth = app ? admin.auth() : null as unknown as admin.auth.Auth;
export const adminStorage = app ? admin.storage() : null as unknown as admin.storage.Storage;
export { admin };

