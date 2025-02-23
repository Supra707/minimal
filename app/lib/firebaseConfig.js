// lib/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // <-- Import Firestore
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3K4pnXo2SybJqSIO_rFzFMVIb4yGZroA",
  authDomain: "focusgate-82aeb.firebaseapp.com",
  projectId: "focusgate-82aeb",
  storageBucket: "focusgate-82aeb.firebasestorage.app",
  messagingSenderId: "943400199899",
  appId: "1:943400199899:web:f01c72d1b56bec9519cefe",
  measurementId: "G-YP1353BXVW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); // <-- Initialize Firestore

// Function to sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user; // Returns user info
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    return null;
  }
};

// Function to sign out
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Sign-Out Error:", error);
  }
};

// Export Firebase Auth
export { auth,db};
