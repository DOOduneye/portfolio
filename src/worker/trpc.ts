import { initTRPC, TRPCError } from "@trpc/server";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./db/schema";

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  ADMIN_TOKEN: string;
  GITHUB_TOKEN?: string;
}

export function createContext(req: Request, env: Env) {
  const header = req.headers.get("authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "");
  return {
    db: drizzle(env.DB, { schema }),
    env,
    isAdmin: token.length > 0 && token === env.ADMIN_TOKEN,
  };
}

export type Context = ReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.isAdmin) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx });
});

export const now = () => new Date().toISOString();
