import { expect, test, mock, beforeEach, describe } from "bun:test";
import { StorageAdapter } from "./storage-adapter";

// Mock global objects
global.localStorage = {
    setItem: mock(() => {}),
    getItem: mock(() => null),
};

// Mock window
global.window = {};

// Mock console.error to keep test output clean
global.console.error = mock(() => {});

describe("StorageAdapter", () => {
    beforeEach(() => {
        global.localStorage.setItem.mockClear();
        global.localStorage.getItem.mockClear();
        global.console.error.mockClear();
        delete global.window.electronAPI;
    });

    test("load uses localStorage when not in Electron", async () => {
        global.localStorage.getItem.mockReturnValue(JSON.stringify([{ id: 1 }]));

        const data = await StorageAdapter.load("test-key");
        expect(data).toEqual([{ id: 1 }]);
        expect(global.localStorage.getItem).toHaveBeenCalledWith("test-key");
    });

    test("save uses localStorage when not in Electron", async () => {
        const data = [{ id: 1 }];
        await StorageAdapter.save("test-key", data);

        expect(global.localStorage.setItem).toHaveBeenCalledWith("test-key", JSON.stringify(data));
    });

    test("load uses electronAPI when in Electron", async () => {
        global.window.electronAPI = {
            loadData: mock(() => Promise.resolve([{ id: 2 }])),
            saveData: mock(() => Promise.resolve(true))
        };

        const data = await StorageAdapter.load("test-key");
        expect(data).toEqual([{ id: 2 }]);
        expect(global.window.electronAPI.loadData).toHaveBeenCalled();
    });

    test("load handles electronAPI.loadData error by returning empty array", async () => {
        global.window.electronAPI = {
            loadData: mock(() => Promise.reject(new Error("Electron Error"))),
        };

        const data = await StorageAdapter.load("test-key");
        expect(data).toEqual([]);
    });

    test("load handles localStorage JSON parse error by returning empty array", async () => {
        global.localStorage.getItem.mockReturnValue("invalid-json");

        const data = await StorageAdapter.load("test-key");
        expect(data).toEqual([]);
    });

    test("save uses electronAPI when in Electron", async () => {
        global.window.electronAPI = {
            saveData: mock(() => Promise.resolve(true))
        };

        const data = [{ id: 1 }];
        const result = await StorageAdapter.save("test-key", data);

        expect(result).toBe(true);
        expect(global.window.electronAPI.saveData).toHaveBeenCalledWith(data);
    });

    test("save handles electronAPI.saveData error by returning false", async () => {
        global.window.electronAPI = {
            saveData: mock(() => Promise.reject(new Error("Save Error")))
        };

        const result = await StorageAdapter.save("test-key", []);
        expect(result).toBe(false);
    });

    test("save handles localStorage.setItem error by returning false", async () => {
        global.localStorage.setItem.mockImplementation(() => {
            throw new Error("Quota Exceeded");
        });

        const result = await StorageAdapter.save("test-key", []);
        expect(result).toBe(false);
    });
});
