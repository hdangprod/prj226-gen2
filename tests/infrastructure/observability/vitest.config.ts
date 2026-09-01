import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/infrastructure/observability/**/*.test.ts"],
  },
});
