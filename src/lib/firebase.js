import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Automatically configured from user setup
// 1. Try to load config from LocalStorage (User's custom project)
const savedConfig = localStorage.getItem('rcc_firebase_config');
let firebaseConfig;

if (savedConfig) {
    try {
        firebaseConfig = JSON.parse(savedConfig);
        console.log("Firebase initialized with USER config");
    } catch (e) {
        console.error("Failed to parse saved config, using default", e);
    }
}

// 2. Fallback to hardcoded default (Development / Demo mode)
if (!firebaseConfig) {
    firebaseConfig = {
        apiKey: "AIzaSyApe3hNdPiniHqz36eyf6zBRTk6U88dRlE",
        authDomain: "commandcenterebaywatch.firebaseapp.com",
        projectId: "commandcenterebaywatch",
        storageBucket: "commandcenterebaywatch.firebasestorage.app",
        messagingSenderId: "724608565131",
        appId: "1:724608565131:web:ad2cc07cfc3defc504b98e",
        measurementId: "G-M71CGVS3Z2"
    };
    console.log("Firebase initialized with DEFAULT config");
}

let app, db, auth;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
} catch (e) {
    console.error("Firebase initialization error", e);
    // If initialization fails (e.g. bad config), clear it so user can retry
    if (savedConfig) {
        console.warn("Clearing bad firebase config from storage");
        localStorage.removeItem('rcc_firebase_config');
    }
}

// Export instances for use in app
export { app, db, auth };

// Legacy helper to satisfy imports
export const initFirebase = (config) => {
    // No-op since we are statically configured now
    return { app, db, auth };
};
