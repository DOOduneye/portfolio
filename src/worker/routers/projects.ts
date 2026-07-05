import { and, asc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { projects } from "../db/schema";
import { now, protectedProcedure, publicProcedure, router } from "../trpc";

const projectInput = z.object({
  name: z.string().min(1).max(128),
  url: z.string().url().nullish(),
  description: z.string().max(1024).default(""),
  sortOrder: z.number().int().default(0),
  visible: z.number().int().min(0).max(1).default(1),
});

export const projectsRouter = router({
  visible: publicProcedure.query(({ ctx }) =>
    ctx.db
      .select()
      .from(projects)
      .where(and(eq(projects.visible, 1), isNull(projects.deletedAt)))
      .orderBy(asc(projects.sortOrder))
  ),

  list: protectedProcedure.query(({ ctx }) =>
    ctx.db
      .select()
      .from(projects)
      .where(isNull(projects.deletedAt))
      .orderBy(asc(projects.sortOrder))
  ),

  create: protectedProcedure
    .input(projectInput)
    .mutation(async ({ ctx, input }) => {
      const timestamp = now();
      const [created] = await ctx.db
        .insert(projects)
        .values({ ...input, createdAt: timestamp, updatedAt: timestamp })
        .returning();
      return created;
    }),

  update: protectedProcedure
    .input(projectInput.partial().extend({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...changes } = input;
      const [updated] = await ctx.db
        .update(projects)
        .set({ ...changes, updatedAt: now() })
        .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
        .returning();
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
      return updated;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const [removed] = await ctx.db
        .update(projects)
        .set({ deletedAt: now() })
        .where(and(eq(projects.id, input.id), isNull(projects.deletedAt)))
        .returning();
      if (!removed) throw new TRPCError({ code: "NOT_FOUND" });
      return { ok: true };
    }),
});
