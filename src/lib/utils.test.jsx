import { expect, test, describe } from "bun:test";
import { formatAddress } from "./utils.jsx";

describe("formatAddress", () => {
  test("returns null for empty input", () => {
    expect(formatAddress(null)).toBeNull();
    expect(formatAddress(undefined)).toBeNull();
    expect(formatAddress("")).toBeNull();
  });

  test("formats single line address", () => {
    const result = formatAddress("123 Main St");
    const children = result.props.children;
    expect(children).toHaveLength(1);
    expect(children[0].props.children[0]).toBe("123 Main St");
    expect(children[0].props.children[1]).toBe(false); // No comma for last
  });

  test("formats multi-line address", () => {
    const result = formatAddress("123 Main St, Springfield, IL");
    const children = result.props.children;
    expect(children).toHaveLength(3);

    expect(children[0].props.children[0]).toBe("123 Main St");
    expect(children[0].props.children[1]).toBe(",");

    expect(children[1].props.children[0]).toBe("Springfield");
    expect(children[1].props.children[1]).toBe(",");

    expect(children[2].props.children[0]).toBe("IL");
    expect(children[2].props.children[1]).toBe(false);
  });

  test("trims whitespace from segments", () => {
    const result = formatAddress("  123 Main St  ,  Springfield  ");
    const children = result.props.children;
    expect(children).toHaveLength(2);
    expect(children[0].props.children[0]).toBe("123 Main St");
    expect(children[1].props.children[0]).toBe("Springfield");
  });

  test("handles empty segments (double commas) by filtering them", () => {
    const result = formatAddress("A, , B");
    const children = result.props.children;
    // We expect only 2 children: "A," and "B"
    expect(children).toHaveLength(2);
    expect(children[0].props.children[0]).toBe("A");
    expect(children[1].props.children[0]).toBe("B");
  });

  test("handles trailing commas by filtering empty last segment", () => {
    const result = formatAddress("A, B, ");
    const children = result.props.children;
    // We expect only 2 children: "A," and "B"
    expect(children).toHaveLength(2);
    expect(children[0].props.children[0]).toBe("A");
    expect(children[1].props.children[0]).toBe("B");
    expect(children[1].props.children[1]).toBe(false); // B should be last now
  });
});
