import { SignJWT, exportJWK, generateKeyPair } from "jose";
import { beforeAll, describe, expect, it, vi } from "vitest";
import {
  UnauthorizedError,
  normalizeTeamDomain,
  requireAccessIdentity,
} from "./access";
import type { Env } from "./env";

const TEAM_DOMAIN = "oduneye.cloudflareaccess.com";
const ISSUER = `https://${TEAM_DOMAIN}`;
const AUD = "aud-tag-for-tests";
const EMAIL = "admin@example.com";
const SUBJECT = "access-subject-1";

let privateKey: CryptoKey;

beforeAll(async () => {
  const pair = await generateKeyPair("RS256", { extractable: true });
  privateKey = pair.privateKey;

  const publicJwk = await exportJWK(pair.publicKey);
  publicJwk.kid = "test-key";
  publicJwk.alg = "RS256";
  publicJwk.use = "sig";

  vi.stubGlobal("fetch", async (input: RequestInfo | URL) => {
    const url = String(input instanceof Request ? input.url : input);
    if (url === `${ISSUER}/cdn-cgi/access/certs`) {
      return new Response(JSON.stringify({ keys: [publicJwk] }), {
        headers: { "content-type": "application/json" },
      });
    }
    throw new Error(`unexpected fetch: ${url}`);
  });
});

interface ClaimOverrides {
  issuer?: string;
  audience?: string;
  email?: string | null;
  subject?: string;
  expiresIn?: string;
}

async function sign(overrides: ClaimOverrides = {}): Promise<string> {
  const claims: Record<string, unknown> = {};
  if (overrides.email !== null) claims.email = overrides.email ?? EMAIL;

  return new SignJWT(claims)
    .setProtectedHeader({ alg: "RS256", kid: "test-key" })
    .setIssuer(overrides.issuer ?? ISSUER)
    .setAudience(overrides.audience ?? AUD)
    .setSubject(overrides.subject ?? SUBJECT)
    .setIssuedAt()
    .setExpirationTime(overrides.expiresIn ?? "1h")
    .sign(privateKey);
}

function env(overrides: Partial<Env> = {}): Env {
  return {
    DB: {} as D1Database,
    ASSETS: {} as Fetcher,
    ENVIRONMENT: "production",
    ALLOWED_EMAIL: EMAIL,
    CF_ACCESS_TEAM_DOMAIN: TEAM_DOMAIN,
    CF_ACCESS_AUD: AUD,
    ...overrides,
  };
}

function request(token?: string): Request {
  return new Request("https://davidoduneye.com/trpc/admin.posts.list", {
    headers: token ? { "Cf-Access-Jwt-Assertion": token } : {},
  });
}

describe("normalizeTeamDomain", () => {
  it("accepts a full team domain unchanged", () => {
    expect(normalizeTeamDomain(TEAM_DOMAIN)).toBe(TEAM_DOMAIN);
  });

  it("expands a bare team name", () => {
    expect(normalizeTeamDomain("oduneye")).toBe(TEAM_DOMAIN);
  });

  it("strips a protocol and trailing slash", () => {
    expect(normalizeTeamDomain(`https://${TEAM_DOMAIN}/`)).toBe(TEAM_DOMAIN);
  });
});

describe("requireAccessIdentity", () => {
  it("returns the identity for a valid token", async () => {
    const identity = await requireAccessIdentity(
      request(await sign()),
      env(),
    );
    expect(identity).toEqual({ email: EMAIL, subject: SUBJECT });
  });

  it("rejects an expired token", async () => {
    const token = await sign({ expiresIn: "-1h" });
    await expect(requireAccessIdentity(request(token), env())).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("rejects a token minted for another Access application", async () => {
    const token = await sign({ audience: "some-other-aud" });
    await expect(requireAccessIdentity(request(token), env())).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("rejects a token from another issuer", async () => {
    const token = await sign({ issuer: "https://evil.cloudflareaccess.com" });
    await expect(requireAccessIdentity(request(token), env())).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("rejects an email outside ALLOWED_EMAIL", async () => {
    const token = await sign({ email: "someone-else@gmail.com" });
    await expect(requireAccessIdentity(request(token), env())).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("accepts a differently cased email", async () => {
    const token = await sign({ email: "Admin@Example.COM" });
    const identity = await requireAccessIdentity(request(token), env());
    expect(identity.subject).toBe(SUBJECT);
  });

  it("rejects a token with no email claim", async () => {
    const token = await sign({ email: null });
    await expect(requireAccessIdentity(request(token), env())).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("rejects a missing header", async () => {
    await expect(requireAccessIdentity(request(), env())).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("rejects a malformed token", async () => {
    await expect(
      requireAccessIdentity(request("not-a-jwt"), env()),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("fails closed when the team domain is unset in production", async () => {
    const token = await sign();
    await expect(
      requireAccessIdentity(
        request(token),
        env({ CF_ACCESS_TEAM_DOMAIN: undefined }),
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("fails closed when the audience is unset in production", async () => {
    const token = await sign();
    await expect(
      requireAccessIdentity(request(token), env({ CF_ACCESS_AUD: undefined })),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("fails closed when the allowed email is unset in production", async () => {
    const token = await sign();
    await expect(
      requireAccessIdentity(request(token), env({ ALLOWED_EMAIL: undefined })),
    ).rejects.toThrow(UnauthorizedError);
  });
});

describe("development bypass", () => {
  it("uses ALLOWED_EMAIL as the identity in development", async () => {
    const identity = await requireAccessIdentity(
      request(),
      env({ ENVIRONMENT: "development" }),
    );
    expect(identity).toEqual({ email: EMAIL, subject: `dev:${EMAIL}` });
  });

  it("is ignored in production", async () => {
    await expect(requireAccessIdentity(request(), env())).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("does not fire when ENVIRONMENT is unset", async () => {
    await expect(
      requireAccessIdentity(request(), env({ ENVIRONMENT: undefined })),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("does not fire for an unrecognised environment", async () => {
    await expect(
      requireAccessIdentity(request(), env({ ENVIRONMENT: "prod" })),
    ).rejects.toThrow(UnauthorizedError);
  });
});
