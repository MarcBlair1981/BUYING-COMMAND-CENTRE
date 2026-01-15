import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Helper to get config from storage to fallback
export const getStoredFirebaseConfig = () => {
    try {
        const stored = localStorage.getItem('rcc_firebase_config');
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        return null;
    }
};

let app, db, auth;

export const initFirebase = (config) => {
    if (!config) {
        config = getStoredFirebaseConfig();
    }

    if (config && !app) {
        try {
            app = initializeApp(config);
            db = getFirestore(app);
            auth = getAuth(app);
            console.log("Firebase initialized");
        } catch (e) {
            console.error("Firebase init failed", e);
        }
    }
    return { app, db, auth };
};

// Initialize if config exists
initFirebase();

export { app, db, auth };
