import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { Effect, Exit } from "effect";
import { getPostBySlug, updatePost, deletePost } from "~/services/posts";

function runEffect<A, E>(effect: Effect.Effect<A, E>) {
  const exit = Effect.runSyncExit(effect);
  if (Exit.isFailure(exit)) {
    const failStr = JSON.stringify(exit.cause);
    if (failStr.includes("PostNotFoundError")) {
      return { ok: false as const, status: 404, error: "Post not found" };
    }
    return { ok: false as const, status: 400, error: "Operation failed" };
  }
  return {
    ok: true as const,
    data: Exit.getOrElse(exit, () => null as never),
  };
}

export const APIRoute = createAPIFileRoute("/api/admin/posts/$slug")({
  GET: async ({ params }) => {
    const result = runEffect(getPostBySlug(params.slug));
    if (!result.ok)
      return json({ error: result.error }, { status: result.status });
    return json(result.data);
  },

  PUT: async ({ request, params }) => {
    const body = await request.json();
    const result = runEffect(
      updatePost(params.slug, {
        title: body.title,
        content: body.content,
        excerpt: body.excerpt,
        tags: body.tags,
      })
    );
    if (!result.ok)
      return json({ error: result.error }, { status: result.status });
    return json(result.data);
  },

  DELETE: async ({ params }) => {
    const result = runEffect(deletePost(params.slug));
    if (!result.ok)
      return json({ error: result.error }, { status: result.status });
    return json({ deleted: true });
  },
});
