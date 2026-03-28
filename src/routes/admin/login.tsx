import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { loginAction, checkAuth } from "~/services/auth";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: async () => {
    const { authenticated } = await checkAuth();
    if (authenticated) {
      throw new Response(null, { status: 302, headers: { Location: "/admin" } });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await loginAction({ data: { password } });
      if (result.success) {
        navigate({ to: "/admin" });
      } else {
        setError(result.error);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm pt-20">
      <h1 className="text-2xl font-bold">Admin</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div>
          <label
            htmlFor="password"
            className="block text-sm text-text-secondary"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Enter admin password"
            required
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
