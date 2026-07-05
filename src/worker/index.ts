import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./routers";
import { createContext, type Env } from "./trpc";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/trpc")) {
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
