import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/application/services/exportDeletion/**/*.test.ts"],
  },
});
