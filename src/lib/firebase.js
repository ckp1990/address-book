import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

/**
 * Reads Firebase configuration from LocalStorage.
 */
function getFirebaseConfig() {
    const apiKey = localStorage.getItem('firebase_api_key');
    const projectId = localStorage.getItem('firebase_project_id');
    const appId = localStorage.getItem('firebase_app_id');
    const authDomain = localStorage.getItem('firebase_auth_domain') || undefined;
    const storageBucket = localStorage.getItem('firebase_storage_bucket') || undefined;
    const messagingSenderId = localStorage.getItem('firebase_messaging_sender_id') || undefined;

    if (apiKey && projectId && appId) {
        return {
            apiKey,
            authDomain,
            projectId,
            storageBucket,
            messagingSenderId,
            appId
        };
    }
    return null;
}

let app = null;
let db = null;
let auth = null;

const config = getFirebaseConfig();

if (config) {
    try {
        app = initializeApp(config);
        db = getFirestore(app);
        auth = getAuth(app);

        // Sign in anonymously to allow access if rules require auth
        signInAnonymously(auth).catch((error) => {
            console.error("Error signing in anonymously:", error);
        });
    } catch (e) {
        console.error("Error initializing Firebase:", e);
    }
}

/**
 * Saves Firebase configuration to LocalStorage and reloads the page.
 */
export function saveFirebaseConfig(config) {
    if (!config.apiKey || !config.projectId || !config.appId) {
        throw new Error("API Key, Project ID, and App ID are required.");
    }
    localStorage.setItem('firebase_api_key', config.apiKey);
    localStorage.setItem('firebase_project_id', config.projectId);
    localStorage.setItem('firebase_app_id', config.appId);

    if (config.authDomain) localStorage.setItem('firebase_auth_domain', config.authDomain);
    if (config.storageBucket) localStorage.setItem('firebase_storage_bucket', config.storageBucket);
    if (config.messagingSenderId) localStorage.setItem('firebase_messaging_sender_id', config.messagingSenderId);

    window.location.reload();
}

/**
 * Clears Firebase configuration from LocalStorage and reloads.
 */
export function clearFirebaseConfig() {
    localStorage.removeItem('firebase_api_key');
    localStorage.removeItem('firebase_project_id');
    localStorage.removeItem('firebase_app_id');
    localStorage.removeItem('firebase_auth_domain');
    localStorage.removeItem('firebase_storage_bucket');
    localStorage.removeItem('firebase_messaging_sender_id');
    window.location.reload();
}

/**
 * Checks if Firebase is configured.
 */
export function isFirebaseConfigured() {
    return !!db;
}

export { db, auth };
