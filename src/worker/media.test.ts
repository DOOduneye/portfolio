import { describe, expect, it } from "vitest"
import { mediaKeyFromPath } from "./media"

const KEY = "a".repeat(64)

describe("mediaKeyFromPath", () => {
  it("accepts a content-addressed key", () => {
    expect(mediaKeyFromPath(`/media/${KEY}.png`)).toBe(`${KEY}.png`)
  })

  it("ignores paths outside the media prefix", () => {
    expect(mediaKeyFromPath("/admin/posts")).toBeNull()
  })

  it("refuses traversal rather than passing it to the bucket", () => {
    expect(mediaKeyFromPath("/media/../../etc/passwd")).toBeNull()
    expect(mediaKeyFromPath(`/media/${KEY}.png/../secret`)).toBeNull()
  })

  it("refuses a key that is not a full digest", () => {
    expect(mediaKeyFromPath("/media/abc.png")).toBeNull()
    expect(mediaKeyFromPath(`/media/${"A".repeat(64)}.png`)).toBeNull()
  })

  it("refuses a key with no extension", () => {
    expect(mediaKeyFromPath(`/media/${KEY}`)).toBeNull()
  })
})
