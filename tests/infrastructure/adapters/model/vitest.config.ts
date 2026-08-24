import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/infrastructure/adapters/model/**/*.test.ts"],
  },
});
