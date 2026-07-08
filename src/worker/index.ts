import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./routers";
import { createContext, type Env } from "./trpc";

function isAdminRequest(pathname: string): boolean {
  return pathname === "/trpc/admin" || pathname.startsWith("/trpc/admin.");
}

function hasAdminToken(request: Request, env: Env): boolean {
  const header = request.headers.get("authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "");
  return token.length > 0 && token === env.ADMIN_TOKEN;
}

function unauthorized(): Response {
  return Response.json(
    { error: { code: "UNAUTHORIZED", message: "Admin token required." } },
    { status: 401 }
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/trpc")) {
      if (isAdminRequest(url.pathname) && !hasAdminToken(request, env)) {
        return unauthorized();
      }

      return fetchRequestHandler({
        endpoint: "/trpc",
        req: request,
        router: appRouter,
        createContext: () => createContext(request, env),
      });
    }

    // Everything else is the admin SPA (built by Vite into ./dist).
    return env.ASSETS.fetch(request);
  },
};
