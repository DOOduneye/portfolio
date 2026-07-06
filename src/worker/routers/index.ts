import { router } from "../trpc";
import { postsRouter } from "./posts";
import { projectsRouter } from "./projects";
import { experiencesRouter } from "./experiences";
import { musicRouter } from "./music";

export const appRouter = router({
  posts: postsRouter,
  projects: projectsRouter,
  experiences: experiencesRouter,
  music: musicRouter,
});

export type AppRouter = typeof appRouter;
