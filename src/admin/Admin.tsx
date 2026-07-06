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
        ? "bg-zinc-900 text-white"
        : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
    }`;

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-52 shrink-0 flex-col gap-8 border-r border-zinc-900 p-5">
        <div>
          <div className="font-semibold text-white">David Oduneye</div>
          <div className="text-xs text-zinc-500">Content admin</div>
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
          <a href="/" className="text-zinc-500 transition-colors hover:text-zinc-300">
            ← View site
          </a>
          <button
            onClick={signOut}
            className="text-left text-zinc-500 transition-colors hover:text-zinc-300"
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
        className="w-full max-w-sm rounded-2xl border border-zinc-900 bg-zinc-900/40 p-8"
      >
        <h1 className="text-lg font-semibold text-white">Content admin</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Enter the admin token to continue.
        </p>
        <input
          type="password"
          autoFocus
          placeholder="Admin token"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-blue-500"
        />
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={checking || !value.trim()}
          className="mt-5 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
        >
          {checking ? "Checking…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
