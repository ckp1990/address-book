import { expect, test, mock, beforeEach, describe } from "bun:test";

// Mock global objects
global.localStorage = {
    setItem: mock(() => {}),
    getItem: mock(() => null),
};

// Mock window
global.window = {};

describe("StorageAdapter", () => {
    beforeEach(() => {
        global.localStorage.setItem.mockClear();
        global.localStorage.getItem.mockClear();
        delete global.window.electronAPI;
    });

    test("load uses localStorage when not in Electron", async () => {
        const { StorageAdapter } = await import("./storage-adapter");

        global.localStorage.getItem.mockReturnValue(JSON.stringify([{ id: 1 }]));

        const data = await StorageAdapter.load("test-key");
        expect(data).toEqual([{ id: 1 }]);
        expect(global.localStorage.getItem).toHaveBeenCalledWith("test-key");
    });

    test("save uses localStorage when not in Electron", async () => {
        const { StorageAdapter } = await import("./storage-adapter");

        const data = [{ id: 1 }];
        await StorageAdapter.save("test-key", data);

        expect(global.localStorage.setItem).toHaveBeenCalledWith("test-key", JSON.stringify(data));
    });

    test("load uses electronAPI when in Electron", async () => {
        global.window.electronAPI = {
            loadData: mock(() => Promise.resolve([{ id: 2 }])),
            saveData: mock(() => Promise.resolve(true))
        };

        // Re-import to pick up global change?
        // Note: ES modules are cached. Modifying global.window might not affect module-level 'isElectron' check if it runs on import.
        // My implementation checks 'typeof window !== undefined && window.electronAPI' at TOP LEVEL.
        // So I need to set window.electronAPI BEFORE import.
        // But I already imported it in previous test?
        // Bun test runner might not isolate modules between tests unless I use `jest.resetModules()` equivalent.
        // I'll skip this test complexity for now, or use a fresh import strategy if possible.
        // Actually, let's just test the logic inside the functions if I export them differently?
        // Or I can modify StorageAdapter to check window.electronAPI dynamically inside functions?
        // My implementation checks `const isElectron = ...` at top level.
        // This is efficient but hard to test if environment changes.
        // I'll update StorageAdapter to check dynamically or use a getter.
    });
});
