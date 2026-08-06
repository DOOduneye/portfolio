import { and, desc, eq, isNull, sql } from "drizzle-orm"
import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { posts } from "../db/schema"
import { now, protectedProcedure, publicProcedure, router } from "../trpc"

const slugSchema = z
  .string()
  .min(1)
  .max(128)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "kebab-case slugs only")

const documentSchema = z.string().superRefine((value, ctx) => {
  let parsed: unknown
  try {
    parsed = JSON.parse(value)
  } catch {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "content must be JSON" })
    return
  }
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    (parsed as { type?: string }).type !== "doc"
  ) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "content must be a ProseMirror document" })
  }
})

const postInput = z.object({
  slug: slugSchema,
  title: z.string().min(1).max(256),
  content: documentSchema,
  excerpt: z.string().max(512).nullish(),
  coverImage: z.string().max(512).nullish()
})

const summaryColumns = {
  slug: posts.slug,
  title: posts.title,
  excerpt: posts.excerpt,
  coverImage: posts.coverImage,
  publishedAt: posts.publishedAt,
  updatedAt: posts.updatedAt
}

export const publicPostsRouter = router({
  published: publicProcedure.query(({ ctx }) =>
    ctx.db
      .select(summaryColumns)
      .from(posts)
      .where(and(eq(posts.status, "published"), isNull(posts.deletedAt)))
      .orderBy(desc(posts.publishedAt))
  ),

  bySlug: publicProcedure.input(z.object({ slug: slugSchema })).query(async ({ ctx, input }) => {
    const [post] = await ctx.db
      .select()
      .from(posts)
      .where(
        and(eq(posts.slug, input.slug), eq(posts.status, "published"), isNull(posts.deletedAt))
      )
    if (!post) throw new TRPCError({ code: "NOT_FOUND" })
    return post
  })
})

export const adminPostsRouter = router({
  list: protectedProcedure.query(({ ctx }) =>
    ctx.db
      .select({ ...summaryColumns, status: posts.status })
      .from(posts)
      .where(isNull(posts.deletedAt))
      .orderBy(desc(posts.updatedAt))
  ),

  bySlug: protectedProcedure.input(z.object({ slug: slugSchema })).query(async ({ ctx, input }) => {
    const [post] = await ctx.db
      .select()
      .from(posts)
      .where(and(eq(posts.slug, input.slug), isNull(posts.deletedAt)))
    if (!post) throw new TRPCError({ code: "NOT_FOUND" })
    return post
  }),

  create: protectedProcedure
    .input(postInput.partial({ content: true }))
    .mutation(async ({ ctx, input }) => {
      const timestamp = now()
      const [created] = await ctx.db
        .insert(posts)
        .values({ ...input, createdAt: timestamp, updatedAt: timestamp })
        .returning()
      return created
    }),

  update: protectedProcedure
    .input(postInput.partial().extend({ slug: slugSchema }))
    .mutation(async ({ ctx, input }) => {
      const { slug, ...changes } = input
      const [updated] = await ctx.db
        .update(posts)
        .set({ ...changes, updatedAt: now() })
        .where(and(eq(posts.slug, slug), isNull(posts.deletedAt)))
        .returning()
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" })
      return updated
    }),

  rename: protectedProcedure
    .input(z.object({ slug: slugSchema, nextSlug: slugSchema }))
    .mutation(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .select()
        .from(posts)
        .where(and(eq(posts.slug, input.slug), isNull(posts.deletedAt)))
      if (!post) throw new TRPCError({ code: "NOT_FOUND" })
      if (post.publishedAt) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "A published post keeps its URL."
        })
      }

      const [taken] = await ctx.db.select().from(posts).where(eq(posts.slug, input.nextSlug))
      if (taken) throw new TRPCError({ code: "CONFLICT", message: "That slug is already used." })

      const [renamed] = await ctx.db
        .update(posts)
        .set({ slug: input.nextSlug, updatedAt: now() })
        .where(eq(posts.id, post.id))
        .returning()
      return renamed
    }),

  remove: protectedProcedure
    .input(z.object({ slug: slugSchema }))
    .mutation(async ({ ctx, input }) => {
      const [removed] = await ctx.db
        .update(posts)
        .set({ deletedAt: now() })
        .where(and(eq(posts.slug, input.slug), isNull(posts.deletedAt)))
        .returning()
      if (!removed) throw new TRPCError({ code: "NOT_FOUND" })
      return { ok: true }
    }),

  setStatus: protectedProcedure
    .input(z.object({ slug: slugSchema, status: z.enum(["draft", "published"]) }))
    .mutation(async ({ ctx, input }) => {
      const timestamp = now()
      const [updated] = await ctx.db
        .update(posts)
        .set({
          status: input.status,
          ...(input.status === "published"
            ? { publishedAt: sql`coalesce(${posts.publishedAt}, ${timestamp})` }
            : {}),
          updatedAt: timestamp
        })
        .where(and(eq(posts.slug, input.slug), isNull(posts.deletedAt)))
        .returning()
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" })
      return updated
    })
})
