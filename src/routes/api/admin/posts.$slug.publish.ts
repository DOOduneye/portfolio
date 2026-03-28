import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { Effect, Exit } from "effect";
import { publishPost } from "~/services/posts";

export const APIRoute = createAPIFileRoute("/api/admin/posts/$slug/publish")({
  POST: async ({ params }) => {
    const exit = Effect.runSyncExit(publishPost(params.slug));
    if (Exit.isFailure(exit)) {
      const failStr = JSON.stringify(exit.cause);
      if (failStr.includes("PostNotFoundError")) {
        return json({ error: "Post not found" }, { status: 404 });
      }
      return json({ error: "Failed to publish" }, { status: 400 });
    }
    return json(Exit.getOrElse(exit, () => null));
  },
});
