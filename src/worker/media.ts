import type { DrizzleD1Database } from "drizzle-orm/d1"
import { writeAudit } from "./audit"
import type * as schema from "./db/schema"

const EXTENSION_BY_TYPE = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/gif", "gif"],
  ["image/webp", "webp"],
  ["image/avif", "avif"]
])

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

const KEY_PATTERN = /^[0-9a-f]{64}\.[a-z0-9]+$/

export const MEDIA_PREFIX = "/media/"
export const MEDIA_UPLOAD_PATH = "/admin/media"

export function mediaKeyFromPath(pathname: string): string | null {
  if (!pathname.startsWith(MEDIA_PREFIX)) return null
  const key = pathname.slice(MEDIA_PREFIX.length)
  return KEY_PATTERN.test(key) ? key : null
}

export const FAVICON_CACHE_CONTROL = "public, max-age=3600"

export async function serveMedia(
  bucket: R2Bucket,
  key: string,
  request: Request,
  cacheControl = "public, max-age=31536000, immutable"
): Promise<Response> {
  const object = await bucket.get(key, { onlyIf: request.headers })

  if (!object) return new Response("Not found", { status: 404 })

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set("etag", object.httpEtag)
  headers.set("cache-control", cacheControl)
  headers.set("x-content-type-options", "nosniff")
  headers.set("content-security-policy", "default-src 'none'; sandbox")

  if (!("body" in object)) return new Response(null, { status: 304, headers })

  return new Response(object.body, { headers })
}

export async function uploadMedia(options: {
  bucket: R2Bucket
  db: DrizzleD1Database<typeof schema>
  request: Request
  actorEmail: string
}): Promise<Response> {
  const { bucket, db, request, actorEmail } = options

  const contentType = (request.headers.get("content-type") ?? "").split(";")[0]?.trim() ?? ""
  const extension = EXTENSION_BY_TYPE.get(contentType)
  if (!extension) {
    return problem(
      415,
      `Unsupported image type. Allowed: ${[...EXTENSION_BY_TYPE.keys()].join(", ")}`
    )
  }

  const bytes = await request.arrayBuffer()
  if (bytes.byteLength === 0) return problem(400, "Empty upload.")
  if (bytes.byteLength > MAX_UPLOAD_BYTES) {
    return problem(413, `Images are limited to ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`)
  }

  const key = `${await sha256Hex(bytes)}.${extension}`
  await bucket.put(key, bytes, { httpMetadata: { contentType } })

  await writeAudit(db, request, {
    actorEmail,
    action: "media.upload",
    resourceType: "media",
    resourceId: key,
    metadata: { contentType, bytes: bytes.byteLength }
  })

  return Response.json({ url: `${MEDIA_PREFIX}${key}` }, { status: 201 })
}

async function sha256Hex(bytes: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes)
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("")
}

function problem(status: number, message: string): Response {
  return Response.json({ error: message }, { status })
}
