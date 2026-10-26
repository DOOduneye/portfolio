import { describe, expect, it } from "vitest"
import { parseIntro } from "./intro"

describe("parseIntro", () => {
  it("leaves plain text as one segment", () => {
    expect(parseIntro("Software engineer at Klaviyo.")).toEqual([
      { text: "Software engineer at Klaviyo." }
    ])
  })

  it("splits a link out of the middle of a sentence", () => {
    expect(parseIntro("Member of technical staff at [Agency](https://www.agency.inc).")).toEqual([
      { text: "Member of technical staff at " },
      { text: "Agency", href: "https://www.agency.inc" },
      { text: "." }
    ])
  })

  it("handles links at the start and end", () => {
    expect(
      parseIntro("[Klaviyo](https://www.klaviyo.com) is home, see [Boston](https://example.com)")
    ).toEqual([
      { text: "Klaviyo", href: "https://www.klaviyo.com" },
      { text: " is home, see " },
      { text: "Boston", href: "https://example.com" }
    ])
  })

  it("does not link a non-http address", () => {
    expect(parseIntro("Reach me at [mail](mailto:a@b.com) anytime")).toEqual([
      { text: "Reach me at [mail](mailto:a@b.com) anytime" }
    ])
  })

  it("does not link a malformed address", () => {
    expect(parseIntro("See [Agency](https://www.agency.inc/a b) today")).toEqual([
      { text: "See [Agency](https://www.agency.inc/a b) today" }
    ])
  })
})
