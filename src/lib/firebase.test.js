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

    test("saveFirebaseConfig saves obfuscated values to localStorage and reloads", async () => {
        const { saveFirebaseConfig } = await import("./firebase");

        const config = {
            apiKey: "test-api-key",
            projectId: "test-project-id",
            appId: "test-app-id",
        };

        saveFirebaseConfig(config);

        // Should start with 'obf:'
        expect(global.localStorage.setItem.mock.calls.some(call => call[0] === "firebase_api_key" && call[1].startsWith("obf:"))).toBe(true);
        expect(global.localStorage.setItem.mock.calls.some(call => call[0] === "firebase_project_id" && call[1].startsWith("obf:"))).toBe(true);
        expect(global.localStorage.setItem.mock.calls.some(call => call[0] === "firebase_app_id" && call[1].startsWith("obf:"))).toBe(true);
        expect(global.window.location.reload).toHaveBeenCalled();
    });

    test("saveFirebaseConfig saves optional fields obfuscated", async () => {
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

        expect(global.localStorage.setItem.mock.calls.some(call => call[0] === "firebase_auth_domain" && call[1].startsWith("obf:"))).toBe(true);
        expect(global.localStorage.setItem.mock.calls.some(call => call[0] === "firebase_storage_bucket" && call[1].startsWith("obf:"))).toBe(true);
        expect(global.localStorage.setItem.mock.calls.some(call => call[0] === "firebase_messaging_sender_id" && call[1].startsWith("obf:"))).toBe(true);
    });

    test("getSavedConfig deobfuscates values correctly", async () => {
        const { saveFirebaseConfig, getSavedConfig } = await import("./firebase");

        const config = {
            apiKey: "test-api-key",
            projectId: "test-project-id",
            appId: "test-app-id",
        };

        saveFirebaseConfig(config);
        const saved = getSavedConfig();

        expect(saved.apiKey).toBe("test-api-key");
        expect(saved.projectId).toBe("test-project-id");
        expect(saved.appId).toBe("test-app-id");
    });

    test("getSavedConfig handles legacy plaintext values", async () => {
        const { getSavedConfig } = await import("./firebase");

        storage['firebase_api_key'] = 'plaintext-key';

        const saved = getSavedConfig();
        expect(saved.apiKey).toBe('plaintext-key');
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
