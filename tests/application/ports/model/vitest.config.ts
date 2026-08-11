import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "tests/application/ports/model/**/*.test.ts",
      "tests/testing/model/**/*.test.ts",
    ],
  },
});
