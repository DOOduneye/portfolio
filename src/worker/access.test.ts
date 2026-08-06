import { SignJWT, exportJWK, generateKeyPair } from "jose"
import { beforeAll, describe, expect, it, vi } from "vitest"
import { UnauthorizedError, normalizeTeamDomain, requireAccessIdentity } from "./access"
import type { Env } from "./env"

const TEAM_DOMAIN = "oduneye.cloudflareaccess.com"
const ISSUER = `https://${TEAM_DOMAIN}`
const AUD = "aud-tag-for-tests"
const EMAIL = "admin@example.com"
const SUBJECT = "access-subject-1"

let privateKey: CryptoKey

beforeAll(async () => {
  const pair = await generateKeyPair("RS256", { extractable: true })
  privateKey = pair.privateKey

  const publicJwk = await exportJWK(pair.publicKey)
  publicJwk.kid = "test-key"
  publicJwk.alg = "RS256"

  vi.stubGlobal("fetch", async (input: RequestInfo | URL) => {
    const url = String(input instanceof Request ? input.url : input)
    if (url === `${ISSUER}/cdn-cgi/access/certs`) {
      return new Response(JSON.stringify({ keys: [publicJwk] }), {
        headers: { "content-type": "application/json" }
      })
    }
    throw new Error(`unexpected fetch: ${url}`)
  })
})

interface Claims {
  issuer?: string
  audience?: string
  email?: string | null
  expiresIn?: string
}

async function sign(claims: Claims = {}): Promise<string> {
  const payload: Record<string, unknown> = {}
  if (claims.email !== null) payload.email = claims.email ?? EMAIL

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "RS256", kid: "test-key" })
    .setIssuer(claims.issuer ?? ISSUER)
    .setAudience(claims.audience ?? AUD)
    .setSubject(SUBJECT)
    .setIssuedAt()
    .setExpirationTime(claims.expiresIn ?? "1h")
    .sign(privateKey)
}

function env(overrides: Partial<Env> = {}): Env {
  return {
    DB: {} as D1Database,
    ASSETS: {} as Fetcher,
    MEDIA: {} as R2Bucket,
    ENVIRONMENT: "production",
    CF_ACCESS_TEAM_DOMAIN: TEAM_DOMAIN,
    CF_ACCESS_AUD: AUD,
    ...overrides
  }
}

function request(token?: string): Request {
  return new Request("https://davidoduneye.com/trpc/admin.posts.list", {
    headers: token ? { "Cf-Access-Jwt-Assertion": token } : {}
  })
}

it("accepts a token Cloudflare would have issued", async () => {
  expect(await requireAccessIdentity(request(await sign()), env())).toEqual({
    email: EMAIL,
    subject: SUBJECT
  })
})

describe("rejects a token that is not ours", () => {
  const cases: Array<[string, Claims]> = [
    ["expired", { expiresIn: "-1h" }],
    ["minted for another Access application", { audience: "other-aud" }],
    ["from another issuer", { issuer: "https://evil.cloudflareaccess.com" }],
    ["carrying no email claim", { email: null }]
  ]

  it.each(cases)("%s", async (_name, claims) => {
    await expect(requireAccessIdentity(request(await sign(claims)), env())).rejects.toThrow(
      UnauthorizedError
    )
  })
})

it("rejects a request with no Access header", async () => {
  await expect(requireAccessIdentity(request(), env())).rejects.toThrow(UnauthorizedError)
})

describe("fails closed when Access is not fully configured", () => {
  it.each(["CF_ACCESS_TEAM_DOMAIN", "CF_ACCESS_AUD"] as const)("%s unset", async key => {
    await expect(
      requireAccessIdentity(request(await sign()), env({ [key]: undefined }))
    ).rejects.toThrow(UnauthorizedError)
  })
})

describe("development bypass", () => {
  it("signs in as a local identity with no token", async () => {
    expect(await requireAccessIdentity(request(), env({ ENVIRONMENT: "development" }))).toEqual({
      email: "dev@localhost",
      subject: "dev"
    })
  })

  it.each(["production", "prod", undefined])(
    "does not fire when ENVIRONMENT is %s",
    async environment => {
      await expect(
        requireAccessIdentity(request(), env({ ENVIRONMENT: environment }))
      ).rejects.toThrow(UnauthorizedError)
    }
  )
})

it("accepts the team domain in either documented form", () => {
  expect(normalizeTeamDomain("oduneye")).toBe(TEAM_DOMAIN)
  expect(normalizeTeamDomain(`https://${TEAM_DOMAIN}/`)).toBe(TEAM_DOMAIN)
})
