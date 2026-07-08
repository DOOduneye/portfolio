import { and, asc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { experiences } from "../db/schema";
import { now, protectedProcedure, publicProcedure, router } from "../trpc";

const experienceInput = z.object({
  role: z.string().min(1).max(128),
  org: z.string().min(1).max(128),
  orgUrl: z.string().url().nullish(),
  dates: z.string().min(1).max(64),
  description: z.string().max(1024).default(""),
  sortOrder: z.number().int().default(0),
  visible: z.number().int().min(0).max(1).default(1),
});

export const publicExperiencesRouter = router({
  visible: publicProcedure.query(({ ctx }) =>
    ctx.db
      .select()
      .from(experiences)
      .where(and(eq(experiences.visible, 1), isNull(experiences.deletedAt)))
      .orderBy(asc(experiences.sortOrder))
  ),
});

export const adminExperiencesRouter = router({
  list: protectedProcedure.query(({ ctx }) =>
    ctx.db
      .select()
      .from(experiences)
      .where(isNull(experiences.deletedAt))
      .orderBy(asc(experiences.sortOrder))
  ),

  create: protectedProcedure
    .input(experienceInput)
    .mutation(async ({ ctx, input }) => {
      const timestamp = now();
      const [created] = await ctx.db
        .insert(experiences)
        .values({ ...input, createdAt: timestamp, updatedAt: timestamp })
        .returning();
      return created;
    }),

  update: protectedProcedure
    .input(experienceInput.partial().extend({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...changes } = input;
      const [updated] = await ctx.db
        .update(experiences)
        .set({ ...changes, updatedAt: now() })
        .where(and(eq(experiences.id, id), isNull(experiences.deletedAt)))
        .returning();
      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });
      return updated;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const [removed] = await ctx.db
        .update(experiences)
        .set({ deletedAt: now() })
        .where(and(eq(experiences.id, input.id), isNull(experiences.deletedAt)))
        .returning();
      if (!removed) throw new TRPCError({ code: "NOT_FOUND" });
      return { ok: true };
    }),
});
