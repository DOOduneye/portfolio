import { router } from "../trpc";
import { adminPostsRouter, publicPostsRouter } from "./posts";
import { adminProjectsRouter, publicProjectsRouter } from "./projects";
import {
  adminExperiencesRouter,
  publicExperiencesRouter,
} from "./experiences";
import { musicRouter } from "./music";

export const appRouter = router({
  public: router({
    posts: publicPostsRouter,
    projects: publicProjectsRouter,
    experiences: publicExperiencesRouter,
    music: musicRouter,
  }),
  admin: router({
    posts: adminPostsRouter,
    projects: adminProjectsRouter,
    experiences: adminExperiencesRouter,
  }),
});

export type AppRouter = typeof appRouter;
