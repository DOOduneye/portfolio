import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { Effect, Exit } from "effect";
import { createPost, listAllPosts } from "~/services/posts";

export const APIRoute = createAPIFileRoute("/api/admin/posts")({
  GET: async () => {
    const posts = Effect.runSync(listAllPosts);
    return json(posts);
  },

  POST: async ({ request }) => {
    const body = await request.json();
    const program = createPost({
      slug: body.slug,
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      tags: body.tags,
    });

    const exit = Effect.runSyncExit(program);
    if (Exit.isFailure(exit)) {
      const failStr = JSON.stringify(exit.cause);
      if (failStr.includes("PostAlreadyExistsError")) {
        return json({ error: "Post with this slug already exists" }, { status: 409 });
      }
      return json({ error: "Failed to create post" }, { status: 400 });
    }
    return json(Exit.getOrElse(exit, () => null), { status: 201 });
  },
});
