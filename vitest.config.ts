import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/worker/**/*.test.ts"],
    environment: "node",
  },
});
