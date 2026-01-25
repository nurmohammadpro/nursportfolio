import admin from "firebase-admin";
import { getApps } from "firebase-admin/app";

let db: admin.firestore.Firestore;
let auth: admin.auth.Auth;
let storage: admin.storage.Storage;

if (getApps().length === 0) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    console.warn(
      "Firebase Admin SDK variables missing. Services not initialized.",
    );
  }
}

// Export functions or check existence before exporting constants
export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();
