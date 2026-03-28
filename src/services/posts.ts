import { Effect, Schema } from "effect";
import { getDb } from "~/db/client";
import { migrate } from "~/db/schema";

// --- Schemas ---

export const PostStatus = Schema.Literal("draft", "published");

export const PostRow = Schema.Struct({
  slug: Schema.String,
  title: Schema.String,
  content: Schema.String,
  excerpt: Schema.NullOr(Schema.String),
  tags: Schema.String,
  status: PostStatus,
  published_at: Schema.NullOr(Schema.String),
  created_at: Schema.String,
  updated_at: Schema.String,
  deleted_at: Schema.NullOr(Schema.String),
});

export const Post = Schema.Struct({
  slug: Schema.String,
  title: Schema.String,
  content: Schema.String,
  excerpt: Schema.NullOr(Schema.String),
  tags: Schema.Array(Schema.String),
  status: PostStatus,
  publishedAt: Schema.NullOr(Schema.String),
  createdAt: Schema.String,
  updatedAt: Schema.String,
});

export type Post = typeof Post.Type;

export interface CreatePostInput {
  slug: string;
  title: string;
  content: string;
  excerpt?: string | null;
  tags?: string[];
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  excerpt?: string | null;
  tags?: string[];
}

// --- Row → Post ---

function rowToPost(row: typeof PostRow.Type): Post {
  return {
    slug: row.slug,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    tags: JSON.parse(row.tags) as string[],
    status: row.status,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// --- Errors ---

export class PostNotFoundError {
  readonly _tag = "PostNotFoundError";
  constructor(readonly slug: string) {}
}

export class PostAlreadyExistsError {
  readonly _tag = "PostAlreadyExistsError";
  constructor(readonly slug: string) {}
}

// --- Migration ---

let migrated = false;
function ensureMigrated() {
  if (!migrated) {
    migrate();
    migrated = true;
  }
}

// --- Service functions ---

export const listPublishedPosts = Effect.sync(() => {
  ensureMigrated();
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM posts WHERE status = 'published' AND deleted_at IS NULL ORDER BY published_at DESC`
    )
    .all() as typeof PostRow.Type[];
  return rows.map(rowToPost);
});

export const listAllPosts = Effect.sync(() => {
  ensureMigrated();
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM posts WHERE deleted_at IS NULL ORDER BY created_at DESC`)
    .all() as typeof PostRow.Type[];
  return rows.map(rowToPost);
});

export const getPostBySlug = (slug: string) =>
  Effect.gen(function* () {
    ensureMigrated();
    const db = getDb();
    const row = db
      .prepare("SELECT * FROM posts WHERE slug = ? AND deleted_at IS NULL")
      .get(slug) as typeof PostRow.Type | undefined;
    if (!row) return yield* Effect.fail(new PostNotFoundError(slug));
    return rowToPost(row);
  });

export const getPublishedPostBySlug = (slug: string) =>
  Effect.gen(function* () {
    ensureMigrated();
    const db = getDb();
    const row = db
      .prepare(
        "SELECT * FROM posts WHERE slug = ? AND status = 'published' AND deleted_at IS NULL"
      )
      .get(slug) as typeof PostRow.Type | undefined;
    if (!row) return yield* Effect.fail(new PostNotFoundError(slug));
    return rowToPost(row);
  });

export const createPost = (input: CreatePostInput) =>
  Effect.gen(function* () {
    ensureMigrated();
    const db = getDb();
    const existing = db.prepare("SELECT slug FROM posts WHERE slug = ?").get(input.slug);
    if (existing) return yield* Effect.fail(new PostAlreadyExistsError(input.slug));

    const now = new Date().toISOString();
    const excerpt = input.excerpt ?? input.content.slice(0, 150).replace(/\n/g, " ");
    const tags = JSON.stringify(input.tags ?? []);

    db.prepare(
      `INSERT INTO posts (slug, title, content, excerpt, tags, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'draft', ?, ?)`
    ).run(input.slug, input.title, input.content, excerpt, tags, now, now);

    return yield* getPostBySlug(input.slug);
  });

export const updatePost = (slug: string, input: UpdatePostInput) =>
  Effect.gen(function* () {
    ensureMigrated();
    const post = yield* getPostBySlug(slug);
    const db = getDb();

    const title = input.title ?? post.title;
    const content = input.content ?? post.content;
    const excerpt = input.excerpt !== undefined ? input.excerpt : post.excerpt;
    const tags = JSON.stringify(input.tags ?? post.tags);
    const now = new Date().toISOString();

    db.prepare(
      `UPDATE posts SET title = ?, content = ?, excerpt = ?, tags = ?, updated_at = ? WHERE slug = ? AND deleted_at IS NULL`
    ).run(title, content, excerpt, tags, now, slug);

    return yield* getPostBySlug(slug);
  });

export const deletePost = (slug: string) =>
  Effect.gen(function* () {
    ensureMigrated();
    yield* getPostBySlug(slug);
    const db = getDb();
    const now = new Date().toISOString();
    db.prepare("UPDATE posts SET deleted_at = ?, updated_at = ? WHERE slug = ?").run(now, now, slug);
  });

export const publishPost = (slug: string) =>
  Effect.gen(function* () {
    ensureMigrated();
    yield* getPostBySlug(slug);
    const db = getDb();
    const now = new Date().toISOString();
    db.prepare(
      `UPDATE posts SET status = 'published', published_at = COALESCE(published_at, ?), updated_at = ? WHERE slug = ? AND deleted_at IS NULL`
    ).run(now, now, slug);
    return yield* getPostBySlug(slug);
  });

export const unpublishPost = (slug: string) =>
  Effect.gen(function* () {
    ensureMigrated();
    yield* getPostBySlug(slug);
    const db = getDb();
    const now = new Date().toISOString();
    db.prepare(
      `UPDATE posts SET status = 'draft', updated_at = ? WHERE slug = ? AND deleted_at IS NULL`
    ).run(now, slug);
    return yield* getPostBySlug(slug);
  });
