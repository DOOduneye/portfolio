import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../worker/routers";

const TOKEN_KEY = "cms-admin-token";

export function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? "";
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/trpc",
      headers: () => ({ authorization: `Bearer ${getToken()}` }),
    }),
  ],
});

export function isUnauthorized(err: unknown): boolean {
  return (err as { data?: { code?: string } })?.data?.code === "UNAUTHORIZED";
}

export function errorMessage(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (/json|fetch|network|load failed/i.test(message)) {
    return "Can't reach the API — is the dev server running?";
  }
  return message;
}
