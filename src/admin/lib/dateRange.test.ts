import { describe, expect, it } from "vitest"
import { formatRange, isRangeComplete, parseRange } from "./dateRange"

describe("parseRange", () => {
  it("round-trips every shape already on the site", () => {
    for (const value of [
      "Jan 2025 - Present",
      "Aug - Nov 2024",
      "May - Aug 2024",
      "Jul 2023 - Jun 2024"
    ]) {
      expect(formatRange(parseRange(value))).toBe(value)
    }
  })

  it("reads a range that ends in the same year", () => {
    expect(parseRange("Aug - Nov 2024")).toEqual({
      startMonth: "Aug",
      startYear: "2024",
      endMonth: "Nov",
      endYear: "2024",
      present: false
    })
  })

  it("drops the end of an ongoing role", () => {
    expect(parseRange("Jan 2025 - Present")).toEqual({
      startMonth: "Jan",
      startYear: "2025",
      endMonth: "",
      endYear: "",
      present: true
    })
  })

  it("survives text it cannot read", () => {
    expect(parseRange("sometime last summer")).toEqual({
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      present: false
    })
  })
})

describe("formatRange", () => {
  it("writes the year once when a role starts and ends in it", () => {
    expect(
      formatRange({
        startMonth: "May",
        startYear: "2024",
        endMonth: "Aug",
        endYear: "2024",
        present: false
      })
    ).toBe("May - Aug 2024")
  })

  it("writes both years when a role spans them", () => {
    expect(
      formatRange({
        startMonth: "Jul",
        startYear: "2023",
        endMonth: "Jun",
        endYear: "2024",
        present: false
      })
    ).toBe("Jul 2023 - Jun 2024")
  })

  it("has nothing to write without a start", () => {
    expect(formatRange({ ...parseRange(""), endMonth: "Nov", endYear: "2024" })).toBe("")
  })
})

describe("isRangeComplete", () => {
  it("accepts an ongoing role with no end", () => {
    expect(isRangeComplete(parseRange("Jan 2025 - Present"))).toBe(true)
  })

  it("rejects a start with a half-filled end", () => {
    expect(
      isRangeComplete({
        startMonth: "Jan",
        startYear: "2025",
        endMonth: "Mar",
        endYear: "",
        present: false
      })
    ).toBe(false)
  })
})
