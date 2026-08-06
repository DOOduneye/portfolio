import { createTRPCClient, httpBatchLink } from "@trpc/client"
import type { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "./worker/routers"

export const publicApi = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "/trpc" })]
})

export type RouterOutputs = inferRouterOutputs<AppRouter>

export function errorMessage(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err)
  if (/json|fetch|network|load failed/i.test(message)) {
    return "Can't reach the API. Try reloading."
  }
  return message
}
