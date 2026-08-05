import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const timestamp = (column: string) =>
  text(column)
    .notNull()
    .default(sql`(datetime('now'))`);

export const auditLog = sqliteTable(
  "audit_log",
  {
    id: text("id").primaryKey(),
    actorEmail: text("actor_email").notNull(),
    action: text("action").notNull(),
    resourceType: text("resource_type").notNull(),
    resourceId: text("resource_id"),
    requestId: text("request_id"),
    ipHint: text("ip_hint"),
    metadataJson: text("metadata_json").notNull().default("{}"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("idx_audit_log_actor_time").on(table.actorEmail, table.createdAt),
    index("idx_audit_log_resource_time").on(
      table.resourceType,
      table.resourceId,
      table.createdAt
    ),
  ]
);

export const kvCache = sqliteTable("kv_cache", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  excerpt: text("excerpt"),
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  publishedAt: text("published_at"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
  deletedAt: text("deleted_at"),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  url: text("url"),
  description: text("description").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: integer("visible").notNull().default(1),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
  deletedAt: text("deleted_at"),
});

export const experiences = sqliteTable("experiences", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  role: text("role").notNull(),
  org: text("org").notNull(),
  orgUrl: text("org_url"),
  dates: text("dates").notNull(),
  description: text("description").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  visible: integer("visible").notNull().default(1),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
  deletedAt: text("deleted_at"),
});
