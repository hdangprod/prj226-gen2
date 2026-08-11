import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/application/ports/persistence/**/*.test.ts", "tests/infrastructure/d1/**/*.test.ts"],
  },
});
