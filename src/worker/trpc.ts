import { initTRPC, TRPCError } from "@trpc/server"
import { drizzle } from "drizzle-orm/d1"
import type { AccessIdentity } from "./access"
import { metadataFromInput, resourceIdFromInput, resourceTypeFromPath, writeAudit } from "./audit"
import * as schema from "./db/schema"
import type { Env } from "./env"

export type { Env }

export interface ContextOptions {
  req: Request
  env: Env
  executionCtx: ExecutionContext
  identity: AccessIdentity | null
}

export function createContext({ req, env, executionCtx, identity }: ContextOptions) {
  return {
    db: drizzle(env.DB, { schema }),
    env,
    req,
    executionCtx,
    identity,
    isAdmin: identity !== null
  }
}

export type Context = ReturnType<typeof createContext>

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure
  .use(({ ctx, next }) => {
    if (!ctx.isAdmin || !ctx.identity) {
      throw new TRPCError({ code: "UNAUTHORIZED" })
    }
    return next({ ctx: { identity: ctx.identity } })
  })
  .use(async ({ ctx, next, path, type, getRawInput }) => {
    const result = await next()
    if (type !== "mutation" || !result.ok) return result

    let rawInput: unknown
    try {
      rawInput = await getRawInput()
    } catch {
      rawInput = undefined
    }

    ctx.executionCtx.waitUntil(
      writeAudit(ctx.db, ctx.req, {
        actorEmail: ctx.identity.email,
        action: path,
        resourceType: resourceTypeFromPath(path),
        resourceId: resourceIdFromInput(rawInput),
        metadata: metadataFromInput(rawInput)
      })
    )

    return result
  })

export const now = () => new Date().toISOString()
