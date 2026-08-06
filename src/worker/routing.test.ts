import { describe, expect, it } from "vitest"
import { canonicalRedirect, isAdminApiRequest, isAdminUiRequest } from "./index"

it("sends www to the apex, preserving path and query", () => {
  expect(canonicalRedirect("https://www.davidoduneye.com/admin/posts?a=1")).toBe(
    "https://davidoduneye.com/admin/posts?a=1"
  )
})

it("leaves the apex and localhost alone", () => {
  expect(canonicalRedirect("https://davidoduneye.com/admin")).toBeNull()
  expect(canonicalRedirect("http://localhost:5173/admin")).toBeNull()
})

describe("isAdminApiRequest", () => {
  it("matches admin procedures, including batched calls", () => {
    expect(isAdminApiRequest("/trpc/admin.posts.list")).toBe(true)
    expect(isAdminApiRequest("/trpc/admin.posts.list,admin.projects.list")).toBe(true)
  })

  it("does not match public procedures or a lookalike name", () => {
    expect(isAdminApiRequest("/trpc/public.posts.published")).toBe(false)
    expect(isAdminApiRequest("/trpc/public.adminNotes.list")).toBe(false)
  })
})

describe("isAdminUiRequest", () => {
  it("matches the admin entry and its subroutes", () => {
    expect(isAdminUiRequest("/admin")).toBe(true)
    expect(isAdminUiRequest("/admin/posts/some-slug")).toBe(true)
  })

  it("does not match the public site or a lookalike path", () => {
    expect(isAdminUiRequest("/")).toBe(false)
    expect(isAdminUiRequest("/administrator")).toBe(false)
  })
})
