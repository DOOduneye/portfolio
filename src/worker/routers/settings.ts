import { eq } from "drizzle-orm"
import type { DrizzleD1Database } from "drizzle-orm/d1"
import { z } from "zod"
import * as schema from "../db/schema"
import { settings } from "../db/schema"
import { now, protectedProcedure, publicProcedure, router } from "../trpc"

export const FAVICON_KEY = "favicon"

const mediaPath = z.string().regex(/^\/media\/[0-9a-f]{64}\.[a-z0-9]+$/, "not an uploaded image")

export async function readSetting(
  db: DrizzleD1Database<typeof schema>,
  key: string
): Promise<string | null> {
  const [row] = await db.select().from(settings).where(eq(settings.key, key))
  return row?.value ?? null
}

export const publicSettingsRouter = router({
  favicon: publicProcedure.query(({ ctx }) => readSetting(ctx.db, FAVICON_KEY))
})

export const adminSettingsRouter = router({
  favicon: protectedProcedure.query(({ ctx }) => readSetting(ctx.db, FAVICON_KEY)),

  setFavicon: protectedProcedure
    .input(z.object({ url: mediaPath.nullable() }))
    .mutation(async ({ ctx, input }) => {
      if (input.url === null) {
        await ctx.db.delete(settings).where(eq(settings.key, FAVICON_KEY))
        return { url: null }
      }

      const timestamp = now()
      await ctx.db
        .insert(settings)
        .values({ key: FAVICON_KEY, value: input.url, updatedAt: timestamp })
        .onConflictDoUpdate({
          target: settings.key,
          set: { value: input.url, updatedAt: timestamp }
        })

      return { url: input.url }
    })
})
