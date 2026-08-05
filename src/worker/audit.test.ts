import { describe, expect, it } from "vitest";
import {
  metadataFromInput,
  resourceIdFromInput,
  resourceTypeFromPath,
} from "./audit";

// writeAudit itself is covered end to end in worker.test.ts against a real D1.
// Asserting that a stubbed insert() was called proves nothing about whether a
// row lands.

describe("resourceTypeFromPath", () => {
  it("takes the router segment from an admin path", () => {
    expect(resourceTypeFromPath("admin.posts.update")).toBe("posts");
    expect(resourceTypeFromPath("admin.experiences.create")).toBe(
      "experiences",
    );
  });

  it("falls back to the whole path when there is no router segment", () => {
    expect(resourceTypeFromPath("ping")).toBe("ping");
  });
});

describe("resourceIdFromInput", () => {
  it("prefers a numeric id, as projects and experiences use", () => {
    expect(resourceIdFromInput({ id: 42, slug: "ignored" })).toBe("42");
  });

  it("falls back to a slug, as posts use", () => {
    expect(resourceIdFromInput({ slug: "hello-world" })).toBe("hello-world");
  });

  it("returns null for a create, which carries neither", () => {
    expect(resourceIdFromInput({ name: "New project" })).toBeNull();
  });

  it("returns null for non-object input", () => {
    expect(resourceIdFromInput(undefined)).toBeNull();
  });
});

describe("metadataFromInput", () => {
  it("drops the content body so posts are not duplicated into the log", () => {
    expect(
      metadataFromInput({ slug: "a", title: "A", content: "<p>long</p>" }),
    ).toEqual({ slug: "a", title: "A" });
  });

  it("returns an empty object for non-object input", () => {
    expect(metadataFromInput(undefined)).toEqual({});
  });
});
