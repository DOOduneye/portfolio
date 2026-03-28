import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { Effect, Exit } from "effect";
import { unpublishPost } from "~/services/posts";

export const APIRoute = createAPIFileRoute("/api/admin/posts/$slug/unpublish")({
  POST: async ({ params }) => {
    const exit = Effect.runSyncExit(unpublishPost(params.slug));
    if (Exit.isFailure(exit)) {
      const failStr = JSON.stringify(exit.cause);
      if (failStr.includes("PostNotFoundError")) {
        return json({ error: "Post not found" }, { status: 404 });
      }
      return json({ error: "Failed to unpublish" }, { status: 400 });
    }
    return json(Exit.getOrElse(exit, () => null));
  },
});
