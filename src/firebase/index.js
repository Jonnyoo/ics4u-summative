import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Paste your firebaseConfig from Firebase Console here
const firebaseConfig = {
    apiKey: "AIzaSyDXr05BrgjmDLaWV3nz77v-ovmJOMnhV7M",
    authDomain: "summative-a9445.firebaseapp.com",
    projectId: "summative-a9445",
    storageBucket: "summative-a9445.firebasestorage.app",
    messagingSenderId: "1057816891558",
    appId: "1:1057816891558:web:002c68729d3c006881a467"
};

const config = initializeApp(firebaseConfig)
const auth = getAuth(config);
const firestore = getFirestore(config);

export { auth, firestore };