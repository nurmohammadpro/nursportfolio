// @/app/lib/firebase-admin.ts
import admin from "firebase-admin";
import { getApps, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

function initializeAdmin() {
  if (getApps().length > 0) {
    return getApp();
  }

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("Firebase Admin SDK: Missing environment variables.");
    return null;
  }

  return admin.initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });
}

// Initialize the app
const app = initializeAdmin();

// Export a function or a getter to ensure we always have the active DB
export const adminDb = getFirestore();
export const adminAuth = admin.auth();
export { admin };
