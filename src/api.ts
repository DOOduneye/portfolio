import { QueryClient } from "@tanstack/react-query"
import { createTRPCClient, httpBatchLink } from "@trpc/client"
import type { inferRouterOutputs } from "@trpc/server"
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import type { AppRouter } from "./worker/routers"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (count, error) => count < 2 && !isUnauthorized(error)
    }
  }
})

const publicClient = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "/trpc" })]
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: publicClient,
  queryClient
})

export type RouterOutputs = inferRouterOutputs<AppRouter>

export function isUnauthorized(error: unknown): boolean {
  return (error as { data?: { code?: string } })?.data?.code === "UNAUTHORIZED"
}

export function errorMessage(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err)
  if (/json|fetch|network|load failed/i.test(message)) {
    return "Can't reach the API. Try reloading."
  }
  return message
}
