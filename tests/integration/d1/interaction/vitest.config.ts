import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/integration/d1/interaction/**/*.test.ts"],
    environment: "node",
  },
});
