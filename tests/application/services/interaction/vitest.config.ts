import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/application/services/interaction/**/*.test.ts"],
    environment: "node",
  },
});
