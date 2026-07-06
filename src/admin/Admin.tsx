import { useState } from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { api, clearToken, errorMessage, getToken, setToken } from "./api";
import { PostsList } from "./pages/PostsList";
import { PostEdit } from "./pages/PostEdit";
import { Projects } from "./pages/Projects";
import { Experiences } from "./pages/Experiences";

export function Admin() {
  const [authed, setAuthed] = useState(Boolean(getToken()));

  if (!authed) return <TokenGate onDone={() => setAuthed(true)} />;

  const signOut = () => {
    clearToken();
    setAuthed(false);
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-raised text-fg"
        : "text-muted hover:bg-surface hover:text-fg"
    }`;

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-52 shrink-0 flex-col gap-8 border-r border-line p-5">
        <div>
          <div className="font-semibold text-fg">David Oduneye</div>
          <div className="text-xs text-subtle">Content admin</div>
        </div>
        <nav className="flex flex-col gap-1">
          <NavLink to="/admin/posts" className={navClass}>
            Posts
          </NavLink>
          <NavLink to="/admin/projects" className={navClass}>
            Projects
          </NavLink>
          <NavLink to="/admin/experiences" className={navClass}>
            Experiences
          </NavLink>
        </nav>
        <div className="mt-auto flex flex-col gap-2 text-sm">
          <a href="/" className="text-subtle transition-colors hover:text-muted">
            ← View site
          </a>
          <button
            onClick={signOut}
            className="text-left text-subtle transition-colors hover:text-muted"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-8 py-10">
        <div className="mx-auto max-w-3xl">
          <Routes>
            <Route index element={<Navigate to="posts" replace />} />
            <Route path="posts" element={<PostsList onAuthError={signOut} />} />
            <Route
              path="posts/:slug"
              element={<PostEdit onAuthError={signOut} />}
            />
            <Route
              path="projects"
              element={<Projects onAuthError={signOut} />}
            />
            <Route
              path="experiences"
              element={<Experiences onAuthError={signOut} />}
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function TokenGate({ onDone }: { onDone: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError(null);
    setToken(value.trim());
    try {
      await api.posts.list.query();
      onDone();
    } catch (err) {
      clearToken();
      setError(
        (err as { data?: { code?: string } })?.data?.code === "UNAUTHORIZED"
          ? "Invalid token."
          : errorMessage(err)
      );
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8"
      >
        <h1 className="text-lg font-semibold text-fg">Content admin</h1>
        <p className="mt-1 text-sm text-subtle">
          Enter the admin token to continue.
        </p>
        <input
          type="password"
          autoFocus
          placeholder="Admin token"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-5 w-full rounded-lg border border-line bg-page px-3.5 py-2 text-sm text-fg placeholder-subtle outline-none transition-colors focus:border-accent"
        />
        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        <button
          type="submit"
          disabled={checking || !value.trim()}
          className="mt-5 w-full rounded-lg bg-accent py-2 text-sm font-medium text-page transition-colors hover:bg-accent-strong disabled:opacity-50"
        >
          {checking ? "Checking…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
