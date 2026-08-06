import { describe, expect, it } from "vitest"
import { EMPTY_DOCUMENT, parseDocument, readingMinutes, slugify, wordCount } from "./document"

const paragraph = (text: string) => ({
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text }] }]
})

describe("parseDocument", () => {
  it("returns an empty document for an empty column", () => {
    expect(parseDocument("")).toEqual({ type: "doc", content: [] })
  })

  it("round-trips a stored document", () => {
    const stored = JSON.stringify(paragraph("hello"))
    expect(parseDocument(stored)).toEqual(paragraph("hello"))
  })

  it("keeps content written before the move off HTML readable", () => {
    expect(parseDocument("<p>test post</p>")).toEqual(paragraph("<p>test post</p>"))
  })

  it("rejects JSON that is not a document", () => {
    expect(parseDocument('{"type":"paragraph"}')).toEqual(paragraph('{"type":"paragraph"}'))
  })

  it("parses the stored default", () => {
    expect(parseDocument(EMPTY_DOCUMENT)).toEqual({ type: "doc", content: [] })
  })
})

describe("wordCount", () => {
  it("counts across nested nodes", () => {
    const document = {
      type: "doc",
      content: [
        { type: "heading", content: [{ type: "text", text: "Two words" }] },
        { type: "paragraph", content: [{ type: "text", text: "and three more" }] }
      ]
    }
    expect(wordCount(document)).toBe(5)
  })

  it("is zero for an empty document", () => {
    expect(wordCount(parseDocument(""))).toBe(0)
  })
})

describe("readingMinutes", () => {
  it("never reports less than a minute", () => {
    expect(readingMinutes(paragraph("short"))).toBe(1)
  })

  it("scales with length", () => {
    expect(readingMinutes(paragraph("word ".repeat(600)))).toBe(3)
  })
})

describe("slugify", () => {
  it("lowercases and joins words with hyphens", () => {
    expect(slugify("Hello There World")).toBe("hello-there-world")
  })

  it("drops punctuation rather than encoding it", () => {
    expect(slugify("What's next? (part 2)")).toBe("what-s-next-part-2")
  })

  it("folds accents to their base letters", () => {
    expect(slugify("Café façade")).toBe("cafe-facade")
  })

  it("does not leave a trailing hyphen", () => {
    expect(slugify("Trailing --- ")).toBe("trailing")
  })

  it("falls back when a title has nothing usable", () => {
    expect(slugify("!!!")).toMatch(/^untitled-[a-z0-9]+$/)
  })

  it("produces a slug the router will accept", () => {
    const pattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    for (const title of ["Hello There World", "What's next? (part 2)", "Café façade", "!!!"]) {
      expect(slugify(title)).toMatch(pattern)
    }
  })
})
