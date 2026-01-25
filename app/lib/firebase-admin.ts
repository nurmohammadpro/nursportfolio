import admin from "firebase-admin";
import { getApps } from "firebase-admin/app";

function initFirebaseAdmin() {
  if (getApps().length > 0) {
    return admin.app();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    throw new Error("Missing Firebase Admin SDK environment variables");
  }

  const cert = admin.credential.cert({
    projectId,
    privateKey,
    clientEmail,
  });

  return admin.initializeApp({
    credential: cert,
  });
}

try {
  initFirebaseAdmin();
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();
