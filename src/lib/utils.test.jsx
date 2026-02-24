import { expect, test, describe } from "bun:test";
import { formatAddress } from "./utils.jsx";

describe("formatAddress", () => {
    test("returns null for empty address", () => {
        expect(formatAddress(null)).toBe(null);
        expect(formatAddress("")).toBe(null);
    });

    test("formats a single line address", () => {
        const result = formatAddress("123 Main St");
        expect(result.type).toBe("Fragment");
        const children = result.props.children;
        expect(children).toHaveLength(1);
        const span = children[0];
        expect(span.type).toBe("span");
        expect(span.props.className).toBe("block");
        // formatAddress maps to [text, !isLast && ',']
        expect(span.props.children).toEqual(["123 Main St", false]);
    });

    test("formats a multi-line address", () => {
        const result = formatAddress("123 Main St, Springfield, IL");
        expect(result.type).toBe("Fragment");
        const children = result.props.children;
        expect(children).toHaveLength(3);

        expect(children[0].props.children).toEqual(["123 Main St", ","]);
        expect(children[1].props.children).toEqual(["Springfield", ","]);
        expect(children[2].props.children).toEqual(["IL", false]);
    });

    test("trims segments", () => {
        const result = formatAddress(" 123 Main St , Springfield ");
        const children = result.props.children;
        expect(children[0].props.children[0]).toBe("123 Main St");
        expect(children[1].props.children[0]).toBe("Springfield");
    });

    test("handles empty segments between commas", () => {
        const result = formatAddress("123 Main St,, Springfield");
        const children = result.props.children;
        expect(children).toHaveLength(3);
        expect(children[1].type).toBe("br");
    });

    test("handles trailing comma", () => {
        const result = formatAddress("123 Main St, ");
        const children = result.props.children;
        expect(children).toHaveLength(2);
        expect(children[0].props.children).toEqual(["123 Main St", ","]);
        expect(children[1].props.children).toEqual(["", false]);
    });

    test("handles non-string input gracefully by returning null if falsy", () => {
        expect(formatAddress(undefined)).toBe(null);
        expect(formatAddress(false)).toBe(null);
    });
});
