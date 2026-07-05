import { and, desc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { posts } from "../db/schema";
import { now, protectedProcedure, publicProcedure, router } from "../trpc";
import { triggerSiteRebuild } from "../rebuild";

const slugSchema = z
  .string()
  .min(1)
  .max(128)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "kebab-case slugs only");

const postInput = z.object({
  slug: slugSchema,
  title: z.string().min(1).max(256),
  content: z.string().default(""),
  excerpt: z.string().max(512).nullish(),
});

export const postsRouter = router({
  // Public: what the static site consumes at build time.
  published: publicProcedure.query(({ ctx }) =>
    ctx.db
      .select()
      .from(posts)
      .where(and(eq(posts.status, "published"), isNull(posts.deletedAt)))
      .orderBy(desc(posts.publishedAt))
  ),

  list: protectedProcedure.query(({ ctx }) =>
    ctx.db
      .select()
      .from(posts)
      .where(isNull(posts.deletedAt))
      .orderBy(desc(posts.updatedAt))
  ),

  bySlug: protectedProcedure
    .input(z.object({ slug: slugSchema }))
    .query(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .select()
        .from(posts)
        .where(and(eq(posts.slug, input.slug), isNull(posts.deletedAt)));
      if (!post) throw new TRPCError({ code: "NOT_FOUND" });
      return post;
    }),

  create: protectedProcedure.input(postInput).mutation(async ({ ctx, input }) => {
    const timestamp = now();
    const [created] = await ctx.db
      .insert(posts)
      .values({ ...input, createdAt: timestamp, updatedAt: timestamp })
      .returning();
    return created;
  }),

  update: protectedProcedure
    .input(postInput.partial().extend({ slug: slugSchema }))
    .mutation(async ({ ctx, input }) => {
      const { slug, ...changes } = input;
      const [updated] = await ctx.db
        .update(posts)
        .set({ ...changes, updatedAt: now() })
        .where(and(eq(posts.slug, slug), isNull(posts.deletedAt)))
        .returning();
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
      return updated;
    }),

  remove: protectedProcedure
    .input(z.object({ slug: slugSchema }))
    .mutation(async ({ ctx, input }) => {
      const [removed] = await ctx.db
        .update(posts)
        .set({ deletedAt: now() })
        .where(and(eq(posts.slug, input.slug), isNull(posts.deletedAt)))
        .returning();
      if (!removed) throw new TRPCError({ code: "NOT_FOUND" });
      return { ok: true };
    }),

  setStatus: protectedProcedure
    .input(z.object({ slug: slugSchema, status: z.enum(["draft", "published"]) }))
    .mutation(async ({ ctx, input }) => {
      const timestamp = now();
      const [updated] = await ctx.db
        .update(posts)
        .set({
          status: input.status,
          publishedAt: input.status === "published" ? timestamp : null,
          updatedAt: timestamp,
        })
        .where(and(eq(posts.slug, input.slug), isNull(posts.deletedAt)))
        .returning();
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
      await triggerSiteRebuild(ctx.env);
      return updated;
    }),
});
