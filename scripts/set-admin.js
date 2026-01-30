/**
 * Admin Elevation Script
 * Run this locally to grant a specific user Admin privileges.
 */

const admin = require("firebase-admin");
const path = require("path");

// 1. Path to your service account key
const serviceAccount = require(path.join(__dirname, "../service-account.json"));

// 2. Initialize the Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// 3. THE EMAIL YOU WANT TO MAKE ADMIN
const userEmail =
  "firebase-adminsdk-fbsvc@nursportfolio-3dd27.iam.gserviceaccount.com";

async function grantAdminRole(email) {
  try {
    // Find the user by email
    const user = await admin.auth().getUserByEmail(email);

    // Set custom user claims
    // The 'role' key here is what your Dashboard and Middleware look for
    await admin.auth().setCustomUserClaims(user.uid, {
      role: "admin",
    });

    console.log(`---`);
    console.log(`SUCCESS: User ${email} is now an Admin.`);
    console.log(`UID: ${user.uid}`);
    console.log(`---`);
    console.log(
      `NOTE: The user must sign out and sign back in for the new claims to take effect.`,
    );

    process.exit(0);
  } catch (error) {
    console.error("Error granting admin role:", error);
    process.exit(1);
  }
}

grantAdminRole(userEmail);
