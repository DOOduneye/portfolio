import { Navigate, NavLink, Route, Routes } from "react-router-dom"
import { signOut } from "./api"
import { PostsList } from "./pages/PostsList"
import { PostEdit } from "./pages/PostEdit"
import { Projects } from "./pages/Projects"
import { Experiences } from "./pages/Experiences"

export function Admin() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
      isActive ? "bg-raised text-fg" : "text-muted hover:bg-surface hover:text-fg"
    }`

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
            <Route path="posts" element={<PostsList />} />
            <Route path="posts/:slug" element={<PostEdit />} />
            <Route path="projects" element={<Projects />} />
            <Route path="experiences" element={<Experiences />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
