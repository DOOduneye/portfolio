import { createRemoteJWKSet, jwtVerify } from "jose"
import type { Env } from "./env"

export interface AccessIdentity {
  email: string
  subject: string
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message)
    this.name = "UnauthorizedError"
  }
}

const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>()

function keySetFor(teamDomain: string) {
  let keySet = keySets.get(teamDomain)
  if (!keySet) {
    keySet = createRemoteJWKSet(new URL(`https://${teamDomain}/cdn-cgi/access/certs`))
    keySets.set(teamDomain, keySet)
  }
  return keySet
}

export function normalizeTeamDomain(value: string): string {
  const trimmed = value
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "")
  return trimmed.includes(".") ? trimmed : `${trimmed}.cloudflareaccess.com`
}

function bypassIdentity(env: Env): AccessIdentity | null {
  if (env.ENVIRONMENT !== "development") return null
  return { email: "dev@localhost", subject: "dev" }
}

export async function requireAccessIdentity(request: Request, env: Env): Promise<AccessIdentity> {
  const bypass = bypassIdentity(env)
  if (bypass) return bypass

  if (!env.CF_ACCESS_TEAM_DOMAIN || !env.CF_ACCESS_AUD) {
    throw new UnauthorizedError("Cloudflare Access is not configured")
  }

  const teamDomain = normalizeTeamDomain(env.CF_ACCESS_TEAM_DOMAIN)

  const token = request.headers.get("Cf-Access-Jwt-Assertion")
  if (!token) throw new UnauthorizedError("Missing Cloudflare Access token")

  let email: unknown
  let subject: string | undefined
  try {
    const { payload } = await jwtVerify(token, keySetFor(teamDomain), {
      issuer: `https://${teamDomain}`,
      audience: env.CF_ACCESS_AUD
    })
    email = payload.email
    subject = payload.sub
  } catch {
    throw new UnauthorizedError("Invalid Cloudflare Access token")
  }

  if (typeof email !== "string" || !email || !subject) {
    throw new UnauthorizedError("Cloudflare Access identity is incomplete")
  }

  return { email, subject }
}
