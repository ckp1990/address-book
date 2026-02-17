import { expect, test, mock, beforeEach, describe } from "bun:test";

// Mock global objects before importing the file that uses them
let storage = {};
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

// Mock Firebase modules
mock.module("firebase/app", () => ({
    initializeApp: mock(() => ({})),
}));

mock.module("firebase/firestore", () => ({
    getFirestore: mock(() => ({})),
}));

mock.module("firebase/auth", () => ({
    getAuth: mock(() => ({})),
    onAuthStateChanged: mock(() => () => {}),
    signInWithEmailAndPassword: mock(() => {}),
    createUserWithEmailAndPassword: mock(() => {}),
    sendPasswordResetEmail: mock(() => {}),
    sendEmailVerification: mock(() => {}),
    signOut: mock(() => {}),
    signInAnonymously: mock(() => {}),
}));

describe("firebase configuration", () => {
    beforeEach(() => {
        // Reset storage and mocks
        for (const key in storage) delete storage[key];
        global.localStorage.setItem.mockClear();
        global.localStorage.getItem.mockClear();
        global.localStorage.removeItem.mockClear();
        global.window.location.reload.mockClear();
    });

    test("saveFirebaseConfig saves to localStorage and reloads", async () => {
        const { saveFirebaseConfig } = await import("./firebase");

        const config = {
            apiKey: "test-api-key",
            projectId: "test-project-id",
            appId: "test-app-id",
        };

        saveFirebaseConfig(config);

        expect(global.localStorage.setItem).toHaveBeenCalledWith("firebase_api_key", "test-api-key");
        expect(global.localStorage.setItem).toHaveBeenCalledWith("firebase_project_id", "test-project-id");
        expect(global.localStorage.setItem).toHaveBeenCalledWith("firebase_app_id", "test-app-id");
        expect(global.window.location.reload).toHaveBeenCalled();
    });

    test("saveFirebaseConfig saves optional fields", async () => {
        const { saveFirebaseConfig } = await import("./firebase");

        const config = {
            apiKey: "test-api-key",
            projectId: "test-project-id",
            appId: "test-app-id",
            authDomain: "test-auth-domain",
            storageBucket: "test-storage-bucket",
            messagingSenderId: "test-sender-id",
        };

        saveFirebaseConfig(config);

        expect(global.localStorage.setItem).toHaveBeenCalledWith("firebase_auth_domain", "test-auth-domain");
        expect(global.localStorage.setItem).toHaveBeenCalledWith("firebase_storage_bucket", "test-storage-bucket");
        expect(global.localStorage.setItem).toHaveBeenCalledWith("firebase_messaging_sender_id", "test-sender-id");
    });

    test("saveFirebaseConfig throws error if required fields are missing", async () => {
        const { saveFirebaseConfig } = await import("./firebase");

        const config = {
            apiKey: "test-api-key",
            // projectId missing
            appId: "test-app-id",
        };

        expect(() => saveFirebaseConfig(config)).toThrow("API Key, Project ID, and App ID are required.");
    });

    test("clearFirebaseConfig removes items from localStorage and reloads", async () => {
        const { clearFirebaseConfig } = await import("./firebase");

        // Pre-fill storage
        storage['firebase_api_key'] = 'some-key';

        clearFirebaseConfig();

        expect(global.localStorage.removeItem).toHaveBeenCalledWith("firebase_api_key");
        expect(global.localStorage.removeItem).toHaveBeenCalledWith("firebase_project_id");
        expect(global.localStorage.removeItem).toHaveBeenCalledWith("firebase_app_id");
        expect(global.localStorage.removeItem).toHaveBeenCalledWith("firebase_auth_domain");
        expect(global.localStorage.removeItem).toHaveBeenCalledWith("firebase_storage_bucket");
        expect(global.localStorage.removeItem).toHaveBeenCalledWith("firebase_messaging_sender_id");
        expect(global.window.location.reload).toHaveBeenCalled();
        expect(storage['firebase_api_key']).toBeUndefined();
    });

    test("isFirebaseConfigured returns boolean", async () => {
        const { isFirebaseConfigured } = await import("./firebase");
        expect(typeof isFirebaseConfigured()).toBe("boolean");
    });
});
