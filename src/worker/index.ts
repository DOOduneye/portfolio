import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { drizzle } from "drizzle-orm/d1"
import { UnauthorizedError, requireAccessIdentity, type AccessIdentity } from "./access"
import * as schema from "./db/schema"
import type { Env } from "./env"
import { MEDIA_UPLOAD_PATH, mediaKeyFromPath, serveMedia, uploadMedia } from "./media"
import { appRouter } from "./routers"
import { createContext } from "./trpc"

const CANONICAL_HOST = "davidoduneye.com"

export function canonicalRedirect(requestUrl: string): string | null {
  const url = new URL(requestUrl)
  if (url.hostname !== `www.${CANONICAL_HOST}`) return null
  url.hostname = CANONICAL_HOST
  return url.toString()
}

export function isAdminApiRequest(pathname: string): boolean {
  return pathname === "/trpc/admin" || pathname.startsWith("/trpc/admin.")
}

export function isAdminUiRequest(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/")
}

export default {
  async fetch(request: Request, env: Env, executionCtx: ExecutionContext): Promise<Response> {
    const canonical = canonicalRedirect(request.url)
    if (canonical) return Response.redirect(canonical, 301)

    const url = new URL(request.url)

    if (url.pathname.startsWith("/trpc")) {
      let identity: AccessIdentity | null = null

      if (isAdminApiRequest(url.pathname)) {
        identity = await resolveIdentity(request, env, url.pathname)
      }

      return fetchRequestHandler({
        endpoint: "/trpc",
        req: request,
        router: appRouter,
        createContext: () => createContext({ req: request, env, executionCtx, identity })
      })
    }

    // Uploaded images are public, and are checked before the admin gate so a
    // published post renders for readers who have no Access token.
    const mediaKey = mediaKeyFromPath(url.pathname)
    if (mediaKey) {
      if (request.method !== "GET" && request.method !== "HEAD") {
        return new Response("Method not allowed", { status: 405 })
      }
      return serveMedia(env.MEDIA, mediaKey, request)
    }

    if (isAdminUiRequest(url.pathname)) {
      const identity = await resolveIdentity(request, env, url.pathname)
      if (!identity) {
        return new Response("Cloudflare Access authentication required.", {
          status: 403,
          headers: { "content-type": "text/plain; charset=utf-8" }
        })
      }

      if (url.pathname === MEDIA_UPLOAD_PATH) {
        if (request.method !== "POST") return new Response("Method not allowed", { status: 405 })
        return uploadMedia({
          bucket: env.MEDIA,
          db: drizzle(env.DB, { schema }),
          request,
          actorEmail: identity.email
        })
      }
    }

    return env.ASSETS.fetch(request)
  }
}

async function resolveIdentity(
  request: Request,
  env: Env,
  pathname: string
): Promise<AccessIdentity | null> {
  try {
    return await requireAccessIdentity(request, env)
  } catch (error) {
    if (!(error instanceof UnauthorizedError)) throw error
    console.error(
      JSON.stringify({
        level: "warn",
        message: "admin request rejected",
        reason: error.message,
        host: new URL(request.url).hostname,
        path: pathname
      })
    )
    return null
  }
}
