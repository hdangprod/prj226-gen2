import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/integration/d1/projectActionContext/**/*.test.ts"],
    testTimeout: 15_000,
  },
});
