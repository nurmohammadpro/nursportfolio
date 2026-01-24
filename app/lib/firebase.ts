// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCH9kxhCjZOp3ftyDJSjXPdOgZs11zYNVQ",
  authDomain: "nursportfolio-3dd27.firebaseapp.com",
  projectId: "nursportfolio-3dd27",
  storageBucket: "nursportfolio-3dd27.firebasestorage.app",
  messagingSenderId: "1081777681894",
  appId: "1:1081777681894:web:7e9b3d8f6668a93203d227",
  measurementId: "G-BMXGHBPV74",
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
