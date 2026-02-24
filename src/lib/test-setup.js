import { mock } from "bun:test";

// Mock React and JSX runtime
mock.module("react", () => ({
    default: {
        createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
        Fragment: "Fragment",
    },
    createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
    Fragment: "Fragment",
}));

mock.module("react/jsx-dev-runtime", () => ({
    jsxDEV: (type, props, key) => ({
        type,
        props,
        key
    }),
    Fragment: "Fragment"
}));

mock.module("react/jsx-runtime", () => ({
    jsx: (type, props, key) => ({
        type,
        props,
        key
    }),
    jsxs: (type, props, key) => ({
        type,
        props,
        key
    }),
    Fragment: "Fragment"
}));
