import type { Env } from "./trpc";

// Fires a repository_dispatch so the static site's GitHub Actions workflow
// rebuilds against the latest published content. Best-effort: content is
// already saved even if the rebuild trigger fails.
export async function triggerSiteRebuild(env: Env): Promise<void> {
  if (!env.GITHUB_TOKEN) return;
  try {
    await fetch(
      "https://api.github.com/repos/DOOduneye/portfolio/dispatches",
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.GITHUB_TOKEN}`,
          accept: "application/vnd.github+json",
          "user-agent": "portfolio-cms",
        },
        body: JSON.stringify({ event_type: "content-published" }),
      }
    );
  } catch {
    // Never fail the mutation over a rebuild hook.
  }
}
