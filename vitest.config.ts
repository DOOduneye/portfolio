import {
  cloudflareTest,
  readD1Migrations,
} from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    cloudflareTest(async () => ({
      singleWorker: true,
      wrangler: { configPath: "./wrangler.jsonc" },
      miniflare: {
        bindings: {
          TEST_MIGRATIONS: await readD1Migrations("migrations"),
          // wrangler.jsonc sets ENVIRONMENT=production, which disables the
          // bypass. Tests need an identity without a real Access token.
          ENVIRONMENT: "development",
        },
      },
    })),
  ],
  test: {
    include: ["src/worker/**/*.test.ts"],
    setupFiles: ["./src/worker/test-setup.ts"],
  },
});
