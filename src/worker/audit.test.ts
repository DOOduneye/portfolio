import { describe, expect, it, vi } from "vitest";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "./db/schema";
import {
  metadataFromInput,
  resourceIdFromInput,
  resourceTypeFromPath,
  writeAudit,
} from "./audit";

type Db = DrizzleD1Database<typeof schema>;

function stubDb(onValues: (row: Record<string, unknown>) => unknown) {
  const values = vi.fn(async (row: Record<string, unknown>) => onValues(row));
  const insert = vi.fn(() => ({ values }));
  return { db: { insert } as unknown as Db, insert, values };
}

function request(): Request {
  return new Request("https://davidoduneye.com/trpc/admin.posts.update", {
    headers: { "cf-ray": "ray-123", "cf-connecting-ip": "203.0.113.7" },
  });
}

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
  it("prefers a numeric id", () => {
    expect(resourceIdFromInput({ id: 42, slug: "ignored" })).toBe("42");
  });

  it("falls back to a slug", () => {
    expect(resourceIdFromInput({ slug: "hello-world" })).toBe("hello-world");
  });

  it("returns null for a create with neither", () => {
    expect(resourceIdFromInput({ name: "New project" })).toBeNull();
  });

  it("returns null for non-object input", () => {
    expect(resourceIdFromInput(undefined)).toBeNull();
    expect(resourceIdFromInput("string")).toBeNull();
  });
});

describe("metadataFromInput", () => {
  it("drops the content body", () => {
    expect(
      metadataFromInput({ slug: "a", title: "A", content: "<p>long</p>" }),
    ).toEqual({ slug: "a", title: "A" });
  });

  it("returns an empty object for non-object input", () => {
    expect(metadataFromInput(undefined)).toEqual({});
  });
});

describe("writeAudit", () => {
  it("writes one row carrying the actor and request metadata", async () => {
    const { db, insert, values } = stubDb(() => undefined);

    await writeAudit(db, request(), {
      actorEmail: "admin@example.com",
      action: "admin.posts.update",
      resourceType: "posts",
      resourceId: "hello-world",
      metadata: { title: "Hello" },
    });

    expect(insert).toHaveBeenCalledTimes(1);
    expect(values).toHaveBeenCalledTimes(1);

    const row = values.mock.calls[0]![0]!;
    expect(row).toMatchObject({
      actorEmail: "admin@example.com",
      action: "admin.posts.update",
      resourceType: "posts",
      resourceId: "hello-world",
      requestId: "ray-123",
      ipHint: "203.0.113.7",
      metadataJson: JSON.stringify({ title: "Hello" }),
    });
    expect(typeof row.id).toBe("string");
    expect(typeof row.createdAt).toBe("string");
  });

  it("stores a null resource id when there is none", async () => {
    const { db, values } = stubDb(() => undefined);

    await writeAudit(db, request(), {
      actorEmail: "admin@example.com",
      action: "admin.projects.create",
      resourceType: "projects",
    });

    expect(values.mock.calls[0]![0]!.resourceId).toBeNull();
  });

  it("swallows a failed write so the mutation still succeeds", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const { db } = stubDb(() => {
      throw new Error("D1 unavailable");
    });

    await expect(
      writeAudit(db, request(), {
        actorEmail: "admin@example.com",
        action: "admin.posts.remove",
        resourceType: "posts",
      }),
    ).resolves.toBeUndefined();

    expect(consoleError).toHaveBeenCalledTimes(1);
    consoleError.mockRestore();
  });
});
