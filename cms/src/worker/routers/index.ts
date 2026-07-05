import { router } from "../trpc";
import { postsRouter } from "./posts";
import { projectsRouter } from "./projects";
import { experiencesRouter } from "./experiences";

export const appRouter = router({
  posts: postsRouter,
  projects: projectsRouter,
  experiences: experiencesRouter,
});

export type AppRouter = typeof appRouter;
