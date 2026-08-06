import { router } from "../trpc"
import { adminPostsRouter, publicPostsRouter } from "./posts"
import { adminProjectsRouter, publicProjectsRouter } from "./projects"
import { adminExperiencesRouter, publicExperiencesRouter } from "./experiences"
import { musicRouter } from "./music"
import { adminSettingsRouter, publicSettingsRouter } from "./settings"

export const appRouter = router({
  public: router({
    posts: publicPostsRouter,
    projects: publicProjectsRouter,
    experiences: publicExperiencesRouter,
    music: musicRouter,
    settings: publicSettingsRouter
  }),
  admin: router({
    posts: adminPostsRouter,
    projects: adminProjectsRouter,
    experiences: adminExperiencesRouter,
    settings: adminSettingsRouter
  })
})

export type AppRouter = typeof appRouter
