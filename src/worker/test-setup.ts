import { applyD1Migrations, env } from "cloudflare:test"
import type { D1Migration } from "@cloudflare/vitest-pool-workers"
import type { Env as WorkerEnv } from "./env"

declare global {
  namespace Cloudflare {
    interface Env extends WorkerEnv {
      TEST_MIGRATIONS: D1Migration[]
    }
  }
}

await applyD1Migrations(env.DB, env.TEST_MIGRATIONS)
