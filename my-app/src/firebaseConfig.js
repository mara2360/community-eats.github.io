// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // For Firestore
import { getStorage } from "firebase/storage";
import { getDatabase } from 'firebase/database';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCm-NLOnjKBF_AeM49QkQRtL65ueC7f4ig",
  authDomain: "community-eats.firebaseapp.com",
  databaseURL: "https://community-eats-default-rtdb.firebaseio.com",
  projectId: "community-eats",
  storageBucket: "community-eats.firebasestorage.app",
  messagingSenderId: "136821069575",
  appId: "1:136821069575:web:3a603f2fe0aae1120c97a2",
  measurementId: "G-5WPGML84QS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
// If you still need Realtime Database separately, you could do:
const db = getDatabase(app);

export { app, auth, googleProvider, db, signInWithPopup };
