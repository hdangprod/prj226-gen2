import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/application/ports/observability/**/*.test.ts"],
  },
});
