import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Configure Vitest
    globals: true, // Use global variables like describe, it, expect
    environment: "jsdom", // Use jsdom for DOM-related tests
    include: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"], // Include test files
    setupFiles: "./setupTests.ts", // Optional: path to setup file for testing
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), // Optional: Create an alias for easier imports
    },
  },
});
