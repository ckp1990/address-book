import { expect, test, mock, describe, beforeEach } from "bun:test";

// Mock globals
let storage = {
    'firebase_api_key': 'mock-api-key',
    'firebase_project_id': 'mock-project-id',
    'firebase_app_id': 'mock-app-id',
};
global.localStorage = {
    setItem: mock((key, value) => {
        storage[key] = value;
    }),
    getItem: mock((key) => storage[key] || null),
    removeItem: mock((key) => {
        delete storage[key];
    }),
    clear: mock(() => {
        storage = {};
    }),
};
global.window = {
    location: {
        reload: mock(() => {}),
    },
};

// Mock Firebase
mock.module("firebase/app", () => ({
    initializeApp: mock(() => ({})),
}));

mock.module("firebase/firestore", () => ({
    getFirestore: mock(() => ({})),
}));

// Create a singleton mock object for auth so we can manipulate state across tests
// even if the module under test captures the reference once.
const authInstance = { currentUser: null };

const mocks = {
    getAuth: mock(() => authInstance),
    onAuthStateChanged: mock((auth, cb) => {
        // Default behavior: call with null (not signed in) asynchronously
        // to avoid ReferenceError in ensureAuth where unsubscribe is called
        setTimeout(() => cb(null), 0);
        return () => {}; // unsubscribe function
    }),
    signInWithEmailAndPassword: mock(() => {}),
    createUserWithEmailAndPassword: mock(() => {}),
    sendPasswordResetEmail: mock(() => {}),
    sendEmailVerification: mock(() => {}),
    signOut: mock(() => {}),
    signInAnonymously: mock(() => Promise.resolve({ user: { uid: 'anon' } })), // Mock it to ensure it's NOT called
};

mock.module("firebase/auth", () => mocks);

describe("security regression tests", () => {
    // We import the module inside the test to trigger top-level execution.
    // However, subsequent imports return the cached module.
    // We rely on manipulating `authInstance` to change state.

    test("ensureAuth resolves with null if user is not signed in, and does NOT call signInAnonymously", async () => {
        const { ensureAuth } = await import("./firebase.js");

        // Reset state
        authInstance.currentUser = null;
        mocks.signInAnonymously.mockClear();
        mocks.onAuthStateChanged.mockClear();

        // Mock onAuthStateChanged to callback with null
        mocks.onAuthStateChanged.mockImplementation((_auth, callback) => {
            setTimeout(() => callback(null), 0);
            return () => {};
        });

        const user = await ensureAuth();

        expect(user).toBeNull();
        expect(mocks.onAuthStateChanged).toHaveBeenCalled();
        expect(mocks.signInAnonymously).not.toHaveBeenCalled();
    });

    test("ensureAuth returns currentUser immediately if already signed in", async () => {
        const { ensureAuth } = await import("./firebase.js");

        const mockUser = { uid: '123' };
        authInstance.currentUser = mockUser;

        mocks.onAuthStateChanged.mockClear();
        mocks.signInAnonymously.mockClear();

        const user = await ensureAuth();

        expect(user).toEqual(mockUser);
        expect(mocks.onAuthStateChanged).not.toHaveBeenCalled();
        expect(mocks.signInAnonymously).not.toHaveBeenCalled();
    });

    test("ensureAuth waits for onAuthStateChanged and resolves with user if they sign in", async () => {
        const { ensureAuth } = await import("./firebase.js");

        authInstance.currentUser = null;
        mocks.signInAnonymously.mockClear();
        mocks.onAuthStateChanged.mockClear();

        const mockUser = { uid: '456' };

        // Mock onAuthStateChanged to simulate async sign-in
        mocks.onAuthStateChanged.mockImplementation((_auth, callback) => {
            // Simulate delay then user available
            setTimeout(() => callback(mockUser), 10);
            return () => {};
        });

        const user = await ensureAuth();

        expect(user).toEqual(mockUser);
        expect(mocks.onAuthStateChanged).toHaveBeenCalled();
        expect(mocks.signInAnonymously).not.toHaveBeenCalled();
    });
});
