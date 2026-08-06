import { Navigate, NavLink, Route, Routes } from "react-router-dom"
import { ArrowUpRight, Briefcase, FileText, LogOut, Layers } from "lucide-react"
import { useState } from "react"
import { signOut } from "./api"
import { SiteMark } from "./components/SiteMark"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { PostsList } from "./pages/PostsList"
import { PostEdit } from "./pages/PostEdit"
import { Projects } from "./pages/Projects"
import { Experiences } from "./pages/Experiences"

const SECTIONS = [
  { to: "/admin/posts", label: "Posts", icon: FileText },
  { to: "/admin/projects", label: "Projects", icon: Layers },
  { to: "/admin/experiences", label: "Experience", icon: Briefcase }
]

export function Admin() {
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card">
        <div className="flex items-center gap-2.5 px-4 py-5">
          <SiteMark onError={setError} />
          <span className="text-sm font-medium text-foreground">davidoduneye.com</span>
        </div>

        <nav className="flex flex-col gap-0.5 px-2.5">
          {SECTIONS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`
              }
            >
              <Icon size={15} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-0.5 border-t border-border p-2.5">
          <a
            href="/"
            className="flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            <ArrowUpRight size={15} strokeWidth={2} />
            View site
          </a>
          <button
            onClick={signOut}
            className="flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            <LogOut size={15} strokeWidth={2} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Each page sets its own measure: a list wants width, an article does not. */}
      <main className="min-w-0 flex-1">
        {error && (
          <div className="px-8 pt-6">
            <Alert variant="destructive">
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          </div>
        )}
        <Routes>
          <Route index element={<Navigate to="posts" replace />} />
          <Route path="posts" element={<PostsList />} />
          <Route path="posts/:slug" element={<PostEdit />} />
          <Route path="projects" element={<Projects />} />
          <Route path="experiences" element={<Experiences />} />
        </Routes>
      </main>
    </div>
  )
}
