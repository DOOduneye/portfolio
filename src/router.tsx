import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
  return createTanStackRouter({
    routeTree,
    scrollRestoration: true,
  });
}

// TanStack Start expects `getRouter` from the router entry
let _router: ReturnType<typeof createRouter> | null = null;
export function getRouter() {
  if (!_router) {
    _router = createRouter();
  }
  return _router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
