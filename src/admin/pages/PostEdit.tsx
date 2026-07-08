import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, errorMessage, isUnauthorized } from "../api";
import { PostEditor } from "../components/PostEditor";
import {
  dangerButton,
  Field,
  ghostButton,
  inputClass,
  primaryButton,
  StatusBadge,
} from "../components/ui";

type Post = Awaited<ReturnType<typeof api.admin.posts.bySlug.query>>;

export function PostEdit({ onAuthError }: { onAuthError: () => void }) {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    api.admin.posts.bySlug
      .query({ slug })
      .then((p) => {
        setPost(p);
        setTitle(p.title);
        setExcerpt(p.excerpt ?? "");
        setContent(p.content);
      })
      .catch((err) => {
        if (isUnauthorized(err)) onAuthError();
        else setError(errorMessage(err));
      });
  }, [slug, onAuthError]);

  const run = async (fn: () => Promise<unknown>) => {
    setSaving(true);
    setError(null);
    try {
      await fn();
    } catch (err) {
      if (isUnauthorized(err)) onAuthError();
      else setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const save = () =>
    run(async () => {
      await api.admin.posts.update.mutate({
        slug,
        title,
        excerpt: excerpt.trim() || null,
        content,
      });
      setSavedAt(Date.now());
    });

  const toggleStatus = () =>
    run(async () => {
      const updated = await api.admin.posts.setStatus.mutate({
        slug,
        status: post?.status === "published" ? "draft" : "published",
      });
      setPost(updated);
    });

  const remove = () =>
    run(async () => {
      if (!confirm(`Delete "${title}"?`)) return;
      await api.admin.posts.remove.mutate({ slug });
      navigate("/admin/posts");
    });

  if (!post && !error) {
    return <p className="text-sm text-subtle">Loading…</p>;
  }

  return (
    <div>
      <header className="flex items-center justify-between gap-4">
        <Link
          to="/admin/posts"
          className="text-sm text-subtle transition-colors hover:text-muted"
        >
          ← Posts
        </Link>
        <div className="flex items-center gap-2.5">
          {savedAt && !saving && (
            <span className="text-xs text-subtle">Saved</span>
          )}
          {post && <StatusBadge status={post.status} />}
          <button onClick={toggleStatus} disabled={saving} className={ghostButton}>
            {post?.status === "published" ? "Unpublish" : "Publish"}
          </button>
          <button onClick={save} disabled={saving} className={primaryButton}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </header>

      {error && (
        <p className="mt-5 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {post && (
        <div className="mt-8 space-y-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="w-full border-none bg-transparent text-3xl font-bold tracking-tight text-fg placeholder-subtle outline-none"
          />
          <p className="-mt-4 text-xs text-subtle">/{slug}</p>

          <Field label="Excerpt">
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="One or two sentences shown in lists and previews."
              className={inputClass}
            />
          </Field>

          <PostEditor initialContent={post.content} onChange={setContent} />

          <div className="border-t border-line pt-4">
            <button onClick={remove} disabled={saving} className={dangerButton}>
              Delete post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
