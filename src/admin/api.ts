import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../worker/routers";

export const api = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "/trpc" })],
});

export function isUnauthorized(err: unknown): boolean {
  return (err as { data?: { code?: string } })?.data?.code === "UNAUTHORIZED";
}

export function reauthenticate(): void {
  window.location.reload();
}

const ACCESS_TEAM_DOMAIN = "oduneye.cloudflareaccess.com";

// Access keeps two tokens: one per application on this domain, and a global
// SSO session on the team domain. Clearing only the first lets the next
// request mint a fresh one silently, so both have to go.
export async function signOut(): Promise<void> {
  await fetch("/cdn-cgi/access/logout").catch(() => {});
  const returnTo = encodeURIComponent(`${window.location.origin}/`);
  window.location.href = `https://${ACCESS_TEAM_DOMAIN}/cdn-cgi/access/logout?returnTo=${returnTo}`;
}

export function errorMessage(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (/json|fetch|network|load failed/i.test(message)) {
    return "Can't reach the API. Is the dev server running?";
  }
  return message;
}
