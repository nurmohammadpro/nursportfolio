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
    const missing = [];
    if (!projectId) missing.push("FIREBASE_PROJECT_ID");
    if (!clientEmail) missing.push("FIREBASE_CLIENT_EMAIL");
    if (!privateKey) missing.push("FIREBASE_PRIVATE_KEY");
    console.error(`Firebase Admin SDK: Missing environment variables: ${missing.join(", ")}`);
    return null;
  }

  try {
    const formattedKey = privateKey.replace(/\\n/g, "\n");
    return admin.initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: formattedKey,
      }),
    });
  } catch (error: any) {
    console.error("Firebase Admin SDK: Initialization failed:", error.message);
    return null;
  }
}

const app = initializeAdmin();

// Explicitly export the services
export const adminDb = app ? getFirestore(app) : (null as any);
export const adminAuth = app ? getAuth(app) : (null as any);
export { admin };
