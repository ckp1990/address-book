import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword as _signInWithEmailAndPassword,
    createUserWithEmailAndPassword as _createUserWithEmailAndPassword,
    sendPasswordResetEmail as _sendPasswordResetEmail,
    sendEmailVerification,
    signOut as _signOut
} from 'firebase/auth';

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
    } catch (e) {
        console.error("Error initializing Firebase:", e);
    }
}

/**
 * Wraps signInWithEmailAndPassword to inject the auth instance.
 */
const signInWithEmailAndPassword = (email, password) => {
    if (!auth) throw new Error("Firebase not initialized");
    return _signInWithEmailAndPassword(auth, email, password);
};

/**
 * Wraps createUserWithEmailAndPassword to inject the auth instance.
 */
const createUserWithEmailAndPassword = (email, password) => {
    if (!auth) throw new Error("Firebase not initialized");
    return _createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Wraps sendPasswordResetEmail to inject the auth instance.
 */
const sendPasswordResetEmail = (email, actionCodeSettings) => {
    if (!auth) throw new Error("Firebase not initialized");
    return _sendPasswordResetEmail(auth, email, actionCodeSettings);
};

/**
 * Wraps signOut to inject the auth instance.
 */
const signOut = () => {
    if (!auth) throw new Error("Firebase not initialized");
    return _signOut(auth);
};

/**
 * Ensures the user is authenticated before performing operations.
 * Returns a promise that resolves to the user object.
 */
export async function ensureAuth() {
    if (!auth) return null;
    if (auth.currentUser) return auth.currentUser;

    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
}

/**
 * Saves Firebase configuration to LocalStorage and reloads the page.
 */
export function saveFirebaseConfig(config) {
    const apiKey = (config.apiKey || '').trim();
    const projectId = (config.projectId || '').trim();
    const appId = (config.appId || '').trim();
    const authDomain = (config.authDomain || '').trim();
    const storageBucket = (config.storageBucket || '').trim();
    const messagingSenderId = (config.messagingSenderId || '').trim();

    if (!apiKey || !projectId || !appId) {
        throw new Error("API Key, Project ID, and App ID are required.");
    }
    localStorage.setItem('firebase_api_key', apiKey);
    localStorage.setItem('firebase_project_id', projectId);
    localStorage.setItem('firebase_app_id', appId);

    if (authDomain) localStorage.setItem('firebase_auth_domain', authDomain);
    if (storageBucket) localStorage.setItem('firebase_storage_bucket', storageBucket);
    if (messagingSenderId) localStorage.setItem('firebase_messaging_sender_id', messagingSenderId);

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

export {
    db,
    auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    signOut
};
