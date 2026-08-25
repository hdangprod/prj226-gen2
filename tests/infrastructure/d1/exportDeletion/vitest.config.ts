import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/infrastructure/d1/exportDeletion/**/*.test.ts"],
  },
});
