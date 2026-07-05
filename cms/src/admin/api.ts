import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../worker/routers";

const TOKEN_KEY = "cms-admin-token";

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? "";
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/trpc",
      headers: () => ({ authorization: `Bearer ${getToken()}` }),
    }),
  ],
});
