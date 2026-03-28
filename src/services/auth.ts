import { createHmac, timingSafeEqual } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import {
  getCookie,
  setCookie,
  deleteCookie,
} from "@tanstack/react-start/server";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET environment variable is required");
  return secret;
}

function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password)
    throw new Error("ADMIN_PASSWORD environment variable is required");
  return password;
}

function createSessionToken(): string {
  const ts = Date.now().toString();
  const sig = createHmac("sha256", getSecret()).update(ts).digest("hex");
  return `${ts}.${sig}`;
}

function verifySessionToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [ts, sig] = parts;
  if (!ts || !sig) return false;
  const expected = createHmac("sha256", getSecret()).update(ts).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export const checkAuth = createServerFn({ method: "GET" }).handler(async () => {
  const token = getCookie(SESSION_COOKIE);
  return { authenticated: !!token && verifySessionToken(token) };
});

export const loginAction = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    if (data.password !== getAdminPassword()) {
      return { success: false as const, error: "Invalid password" };
    }
    const token = createSessionToken();
    setCookie(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
    return { success: true as const };
  });

export const logoutAction = createServerFn({ method: "POST" }).handler(
  async () => {
    deleteCookie(SESSION_COOKIE, { path: "/" });
    return { success: true };
  }
);
