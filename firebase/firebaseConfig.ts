// firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC71xgl8A794SYgIKkvtVqMvprgCJosgtk",
  authDomain: "nutrilens-3ff5e.firebaseapp.com",
  projectId: "nutrilens-3ff5e",
  storageBucket: "nutrilens-3ff5e.firebasestorage.app",
  messagingSenderId: "695720829105",
  appId: "1:695720829105:web:010d9981d0f5789b880290",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const auth = getAuth(app);