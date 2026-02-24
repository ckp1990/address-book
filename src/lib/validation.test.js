import { expect, test, describe } from "bun:test";
import { validatePhone } from "./validation";

describe("validatePhone", () => {
    test("validates standard international format", () => {
        expect(validatePhone("+1 (555) 000-0000")).toBe(true);
    });

    test("validates simple number", () => {
        expect(validatePhone("1234567890")).toBe(true);
    });

    test("validates number with hyphens", () => {
        expect(validatePhone("555-000-0000")).toBe(true);
    });

    test("allows empty string (optional field)", () => {
        expect(validatePhone("")).toBe(true);
        expect(validatePhone(null)).toBe(true);
    });

    test("rejects strings without digits", () => {
        expect(validatePhone("+ () - ")).toBe(false);
    });

    test("rejects strings with letters", () => {
        expect(validatePhone("123-456-7890a")).toBe(false);
        expect(validatePhone("invalid")).toBe(false);
    });

    test("rejects strings that are too short", () => {
        expect(validatePhone("123")).toBe(false);
    });

    test("rejects strings that are too long", () => {
        expect(validatePhone("123456789012345678901")).toBe(false);
    });

    test("rejects potential XSS / malicious strings", () => {
        expect(validatePhone("<script>alert(1)</script>")).toBe(false);
        expect(validatePhone("javascript:alert(1)")).toBe(false);
        expect(validatePhone("' OR '1'='1")).toBe(false);
    });
});
