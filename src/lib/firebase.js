import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Automatically configured from user setup
const firebaseConfig = {
    apiKey: "AIzaSyApe3hNdPiniHqz36eyf6zBRTk6U88dRlE",
    authDomain: "commandcenterebaywatch.firebaseapp.com",
    projectId: "commandcenterebaywatch",
    storageBucket: "commandcenterebaywatch.firebasestorage.app",
    messagingSenderId: "724608565131",
    appId: "1:724608565131:web:ad2cc07cfc3defc504b98e",
    measurementId: "G-M71CGVS3Z2"
};

let app, db, auth;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("Firebase initialized with hardcoded config");
} catch (e) {
    console.error("Firebase initialization error", e);
}

// Export instances for use in app
export { app, db, auth };

// Legacy helper to satisfy imports
export const initFirebase = (config) => {
    // No-op since we are statically configured now
    return { app, db, auth };
};
