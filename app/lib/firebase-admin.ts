// @/app/lib/firebase-admin.ts
import admin from "firebase-admin";
import { getApps, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth"; // Ensure this is imported

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

function initializeAdmin() {
  if (getApps().length > 0) return getApp();

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("Firebase Admin SDK: Missing environment variables.");
    return null;
  }

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

// Explicitly export the services
export const adminDb = app ? getFirestore(app) : (null as any);
export const adminAuth = app ? getAuth(app) : (null as any);
export { admin };
