// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsJLz9JRFaincv8Os6jeFGyDE8bONGxUA",
  authDomain: "poc-chat-app-533db.firebaseapp.com",
  projectId: "poc-chat-app-533db",
  storageBucket: "poc-chat-app-533db.appspot.com",
  messagingSenderId: "557402318028",
  appId: "1:557402318028:web:4c21c61b6c04e1fceb0e69",
  measurementId: "G-TTJ4Y2GZ2N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

export { auth, db };
