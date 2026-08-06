import { createTRPCClient, httpBatchLink, type TRPCLink } from "@trpc/client"
import { observable } from "@trpc/server/observable"
import type { AppRouter } from "../worker/routers"

export { errorMessage, type RouterOutputs } from "../api"

const ACCESS_TEAM_DOMAIN = "oduneye.cloudflareaccess.com"

/**
 * An expired Access session is a property of the session, not of any one
 * screen. Handling it here is what keeps auth out of every page: a reload
 * bounces through Access and comes back with a fresh token.
 */
const reauthenticateOnExpiry: TRPCLink<AppRouter> =
  () =>
  ({ op, next }) =>
    observable(observer =>
      next(op).subscribe({
        next: value => observer.next(value),
        error: error => {
          // No observer.error: the document is being replaced, and reporting the
          // failure would flash an error over a page that is already leaving.
          if (error.data?.code === "UNAUTHORIZED") return window.location.reload()
          observer.error(error)
        },
        complete: () => observer.complete()
      })
    )

export const api = createTRPCClient<AppRouter>({
  links: [reauthenticateOnExpiry, httpBatchLink({ url: "/trpc" })]
})

export async function signOut(): Promise<void> {
  // Two sessions exist: one for this application and one for the team domain.
  // Clearing only the first leaves the next visit signed straight back in.
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
