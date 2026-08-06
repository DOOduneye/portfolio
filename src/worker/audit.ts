import type { DrizzleD1Database } from "drizzle-orm/d1"
import * as schema from "./db/schema"
import { auditLog } from "./db/schema"

type Db = DrizzleD1Database<typeof schema>

export interface AuditInput {
  actorEmail: string
  action: string
  resourceType: string
  resourceId?: string | null
  metadata?: Record<string, unknown>
}

export function resourceTypeFromPath(path: string): string {
  const [, resource] = path.split(".").reverse()
  return resource ?? path
}

export function resourceIdFromInput(input: unknown): string | null {
  if (!input || typeof input !== "object") return null
  const record = input as Record<string, unknown>
  for (const key of ["id", "slug"]) {
    const value = record[key]
    if (typeof value === "string" && value) return value
    if (typeof value === "number") return String(value)
  }
  return null
}

export function metadataFromInput(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object") return {}
  const { content: _content, ...rest } = input as Record<string, unknown>
  return rest
}

export async function writeAudit(db: Db, request: Request, input: AuditInput): Promise<void> {
  try {
    await db.insert(auditLog).values({
      id: crypto.randomUUID(),
      actorEmail: input.actorEmail,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId ?? null,
      requestId: request.headers.get("cf-ray"),
      ipHint: request.headers.get("cf-connecting-ip"),
      metadataJson: JSON.stringify(input.metadata ?? {}),
      createdAt: new Date().toISOString()
    })
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "audit write failed",
        action: input.action,
        error: error instanceof Error ? error.message : String(error)
      })
    )
  }
}
