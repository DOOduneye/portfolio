import { useCallback, useEffect, useState } from "react";
import { api, getToken, setToken } from "./api";
import { PostEditor } from "./components/PostEditor";
import "./styles.css";

type Post = Awaited<ReturnType<typeof api.posts.list.query>>[number];

export function Admin() {
  const [authed, setAuthed] = useState(Boolean(getToken()));

  return (
    <div className="admin">
      {authed ? (
        <Posts onAuthError={() => setAuthed(false)} />
      ) : (
        <TokenGate onDone={() => setAuthed(true)} />
      )}
    </div>
  );
}

function TokenGate({ onDone }: { onDone: () => void }) {
  const [value, setValue] = useState("");
  return (
    <main className="gate">
      <h1>Admin</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setToken(value.trim());
          onDone();
        }}
      >
        <input
          type="password"
          placeholder="Admin token"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">Enter</button>
      </form>
    </main>
  );
}

function Posts({ onAuthError }: { onAuthError: () => void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    api.posts.list
      .query()
      .then(setPosts)
      .catch((err) => {
        if (err?.data?.code === "UNAUTHORIZED") onAuthError();
        else setError(String(err.message ?? err));
      });
  }, [onAuthError]);

  useEffect(refresh, [refresh]);

  const createPost = async () => {
    const title = prompt("Post title?");
    if (!title) return;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    await api.posts.create.mutate({ title, slug, content: "" });
    refresh();
  };

  if (editing) {
    return (
      <Editor
        post={editing}
        onBack={() => {
          setEditing(null);
          refresh();
        }}
      />
    );
  }

  return (
    <main>
      <header className="row">
        <h1>Posts</h1>
        <button onClick={createPost}>New post</button>
      </header>
      {error && <p className="error">{error}</p>}
      <ul className="posts">
        {posts.map((post) => (
          <li key={post.slug} className="row">
            <button className="link" onClick={() => setEditing(post)}>
              {post.title}
            </button>
            <span className="meta">
              {post.status}
              <button
                onClick={async () => {
                  await api.posts.setStatus.mutate({
                    slug: post.slug,
                    status: post.status === "published" ? "draft" : "published",
                  });
                  refresh();
                }}
              >
                {post.status === "published" ? "Unpublish" : "Publish"}
              </button>
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Editor({ post, onBack }: { post: Post; onBack: () => void }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await api.posts.update.mutate({ slug: post.slug, title, content });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main>
      <header className="row">
        <button onClick={onBack}>← Posts</button>
        <button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </header>
      <input
        className="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <PostEditor initialContent={content} onChange={setContent} />
    </main>
  );
}
