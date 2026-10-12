import { expect, test, describe } from "bun:test";
import { obfuscate, deobfuscate } from "./crypto";

describe("crypto utility", () => {
    test("obfuscate and deobfuscate", () => {
        const originalText = "my-secret-api-key";
        const obfuscated = obfuscate(originalText);

        expect(obfuscated).not.toBe(originalText);
        expect(typeof obfuscated).toBe("string");

        const deobfuscated = deobfuscate(obfuscated);
        expect(deobfuscated).toBe(originalText);
    });

    test("handles empty strings", () => {
        expect(obfuscate("")).toBe("");
        expect(deobfuscate("")).toBe("");
    });

    test("handles null or undefined", () => {
        expect(obfuscate(null)).toBe("");
        expect(deobfuscate(null)).toBe("");
    });

    test("obfuscation is consistent", () => {
        const text = "test-value";
        expect(obfuscate(text)).toBe(obfuscate(text));
    });

    test("deobfuscation handles invalid input gracefully", () => {
        // Not a valid base64 string
        expect(deobfuscate("!!!")).toBe("");
    });
});
