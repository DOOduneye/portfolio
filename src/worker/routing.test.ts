import { describe, expect, it } from "vitest";
import {
  canonicalRedirect,
  isAdminApiRequest,
  isAdminUiRequest,
} from "./index";

describe("canonicalRedirect", () => {
  it("sends www to the apex, preserving path and query", () => {
    expect(canonicalRedirect("https://www.davidoduneye.com/admin/posts?a=1")).toBe(
      "https://davidoduneye.com/admin/posts?a=1",
    );
  });

  it("redirects the www admin API, the case that was left ungated", () => {
    expect(
      canonicalRedirect("https://www.davidoduneye.com/trpc/admin.posts.list"),
    ).toBe("https://davidoduneye.com/trpc/admin.posts.list");
  });

  it("leaves the apex alone", () => {
    expect(canonicalRedirect("https://davidoduneye.com/admin")).toBeNull();
  });

  it("leaves localhost alone so dev is unaffected", () => {
    expect(canonicalRedirect("http://localhost:5173/admin")).toBeNull();
  });
});

describe("isAdminApiRequest", () => {
  it("matches admin procedures, batched or not", () => {
    expect(isAdminApiRequest("/trpc/admin.posts.list")).toBe(true);
    expect(isAdminApiRequest("/trpc/admin.posts.list,admin.projects.list")).toBe(
      true,
    );
    expect(isAdminApiRequest("/trpc/admin")).toBe(true);
  });

  it("does not match public procedures", () => {
    expect(isAdminApiRequest("/trpc/public.posts.published")).toBe(false);
    expect(isAdminApiRequest("/trpc/public.music.topTrack")).toBe(false);
  });

  it("does not match a procedure merely containing admin", () => {
    expect(isAdminApiRequest("/trpc/public.adminNotes.list")).toBe(false);
  });
});

describe("isAdminUiRequest", () => {
  it("matches the admin entry and its subroutes", () => {
    expect(isAdminUiRequest("/admin")).toBe(true);
    expect(isAdminUiRequest("/admin/posts")).toBe(true);
    expect(isAdminUiRequest("/admin/posts/some-slug")).toBe(true);
  });

  it("does not match the public site", () => {
    expect(isAdminUiRequest("/")).toBe(false);
    expect(isAdminUiRequest("/assets/index-abc.js")).toBe(false);
  });

  it("does not match a path merely prefixed with admin", () => {
    expect(isAdminUiRequest("/administrator")).toBe(false);
  });
});
