import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom"; // Import jest-dom for default matchers
import matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect with Jest DOM matchers
// expect.extend(matchers);

afterEach(cleanup);
