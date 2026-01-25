import admin from "firebase-admin";
import { getApps } from "firebase-admin/app";

function initFirebaseAdmin() {
  if (getApps().length > 0) {
    return admin.app();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase Admin SDK environment variables.");
  }

  const cert = admin.credential.cert({
    projectId,
    clientEmail,

    privateKey: privateKey.replace(/\\n/g, "\n"),
  });

  return admin.initializeApp({
    credential: cert,
  });
}

try {
  initFirebaseAdmin();
} catch (error) {
  console.error("Failed to initialize Firebase Admin SDK:", error);
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();
