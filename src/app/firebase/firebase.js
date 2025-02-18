// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtXZiOh_LzIutWepH1HrYFtP9E-OXdNOw",
  authDomain: "nexario-da550.firebaseapp.com",
  projectId: "nexario-da550",
  storageBucket: "nexario-da550.firebasestorage.app",
  messagingSenderId: "103707042438",
  appId: "1:103707042438:web:b567516157e6dd23f1a707",
  measurementId: "G-82F9VHV68K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
facebookProvider.setCustomParameters({
  display: "popup", // Optional: To adjust the UI as you want
});
export { app, analytics, auth, googleProvider, facebookProvider };
