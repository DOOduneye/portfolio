CREATE TABLE posts_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT
);

INSERT INTO posts_new (
  id, slug, title, content, excerpt, status,
  published_at, created_at, updated_at, deleted_at
)
SELECT
  id, slug, title, content, excerpt, status,
  published_at, created_at, updated_at, deleted_at
FROM posts;

DROP TABLE posts;

ALTER TABLE posts_new RENAME TO posts;

CREATE UNIQUE INDEX posts_slug_unique ON posts (slug);
