// @/app/lib/firebase-admin.ts
import admin from "firebase-admin";
import { getApps, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

function initializeAdmin() {
  // If an app already exists, use it.
  if (getApps().length > 0) {
    return getApp();
  }

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("Firebase Admin SDK: Missing environment variables.");
    return null;
  }

  // Ensure the private key is formatted correctly for production
  const formattedKey = privateKey.replace(/\\n/g, "\n");

  return admin.initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: formattedKey,
    }),
  });
}

const app = initializeAdmin();

// Export the specific Firestore instance tied to the initialized app
export const adminDb = app ? getFirestore(app) : (null as any);
export { admin };
