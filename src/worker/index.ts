import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import {
  UnauthorizedError,
  requireAccessIdentity,
  type AccessIdentity,
} from "./access";
import type { Env } from "./env";
import { appRouter } from "./routers";
import { createContext } from "./trpc";

const CANONICAL_HOST = "davidoduneye.com";

export function canonicalRedirect(requestUrl: string): string | null {
  const url = new URL(requestUrl);
  if (url.hostname !== `www.${CANONICAL_HOST}`) return null;
  url.hostname = CANONICAL_HOST;
  return url.toString();
}

export function isAdminApiRequest(pathname: string): boolean {
  return pathname === "/trpc/admin" || pathname.startsWith("/trpc/admin.");
}

export function isAdminUiRequest(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export default {
  async fetch(
    request: Request,
    env: Env,
    executionCtx: ExecutionContext
  ): Promise<Response> {
    const canonical = canonicalRedirect(request.url);
    if (canonical) return Response.redirect(canonical, 301);

    const url = new URL(request.url);

    if (url.pathname.startsWith("/trpc")) {
      let identity: AccessIdentity | null = null;

      if (isAdminApiRequest(url.pathname)) {
        identity = await resolveIdentity(request, env, url.pathname);
      }

      return fetchRequestHandler({
        endpoint: "/trpc",
        req: request,
        router: appRouter,
        createContext: () =>
          createContext({ req: request, env, executionCtx, identity }),
      });
    }

    if (isAdminUiRequest(url.pathname)) {
      const identity = await resolveIdentity(request, env, url.pathname);
      if (!identity) {
        return new Response("Cloudflare Access authentication required.", {
          status: 403,
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
      }
    }

    return env.ASSETS.fetch(request);
  },
};

async function resolveIdentity(
  request: Request,
  env: Env,
  pathname: string
): Promise<AccessIdentity | null> {
  try {
    return await requireAccessIdentity(request, env);
  } catch (error) {
    if (!(error instanceof UnauthorizedError)) throw error;
    console.error(
      JSON.stringify({
        level: "warn",
        message: "admin request rejected",
        reason: error.message,
        host: new URL(request.url).hostname,
        path: pathname,
      })
    );
    return null;
  }
}
