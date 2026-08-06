import { createTRPCClient, httpBatchLink } from "@trpc/client"
import type { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "./worker/routers"

/**
 * The reader's client. It carries no session handling, so a signed-out visitor
 * is never bounced anywhere.
 */
export const publicApi = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "/trpc" })]
})

/** Derived from the router so a shape is never restated by hand on the client. */
export type RouterOutputs = inferRouterOutputs<AppRouter>

export function errorMessage(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err)
  if (/json|fetch|network|load failed/i.test(message)) {
    return "Can't reach the API. Try reloading."
  }
  return message
}
