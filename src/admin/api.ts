import { createTRPCClient, httpBatchLink, type TRPCLink } from "@trpc/client"
import { observable } from "@trpc/server/observable"
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import { isUnauthorized, queryClient } from "../api"
import type { AppRouter } from "../worker/routers"

export { errorMessage, isUnauthorized, queryClient, type RouterOutputs } from "../api"

const ACCESS_TEAM_DOMAIN = "oduneye.cloudflareaccess.com"

const reauthenticateOnExpiry: TRPCLink<AppRouter> =
  () =>
  ({ op, next }) =>
    observable(observer =>
      next(op).subscribe({
        next: value => observer.next(value),
        error: error => {
          if (isUnauthorized(error)) return window.location.reload()
          observer.error(error)
        },
        complete: () => observer.complete()
      })
    )

const adminClient = createTRPCClient<AppRouter>({
  links: [reauthenticateOnExpiry, httpBatchLink({ url: "/trpc" })]
})

export const api = createTRPCOptionsProxy<AppRouter>({
  client: adminClient,
  queryClient
})

export async function signOut(): Promise<void> {
  await fetch("/cdn-cgi/access/logout").catch(() => {})
  const returnTo = encodeURIComponent(`${window.location.origin}/`)
  window.location.href = `https://${ACCESS_TEAM_DOMAIN}/cdn-cgi/access/logout?returnTo=${returnTo}`
}

export async function uploadImage(file: File): Promise<string> {
  const response = await fetch("/admin/media", {
    method: "POST",
    headers: { "content-type": file.type },
    body: file
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? `Upload failed (${response.status})`)
  }

  const { url } = (await response.json()) as { url: string }
  return url
}
