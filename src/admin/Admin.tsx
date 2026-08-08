import { useCallback, useState } from "react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import { AdminSidebar } from "./components/AdminSidebar"
import { CommandMenu, useAdminShortcuts } from "./components/CommandMenu"
import { PostsList } from "./pages/PostsList"
import { PostEdit } from "./pages/PostEdit"
import { Projects } from "./pages/Projects"
import { Experiences } from "./pages/Experiences"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"

export function Admin() {
  const [commandsOpen, setCommandsOpen] = useState(false)
  const openCommands = useCallback(() => setCommandsOpen(true), [])

  useAdminShortcuts(openCommands)
  const { pathname } = useLocation()

  return (
    <SidebarProvider>
      <AdminSidebar onOpenCommands={openCommands} />
      <SidebarInset className="min-w-0">
        <div
          key={pathname}
          className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-200 motion-safe:ease-out"
        >
          <Routes>
            <Route index element={<Navigate to="posts" replace />} />
            <Route path="posts" element={<PostsList />} />
            <Route path="posts/:slug" element={<PostEdit />} />
            <Route path="projects" element={<Projects />} />
            <Route path="experiences" element={<Experiences />} />
          </Routes>
        </div>
      </SidebarInset>
      <CommandMenu open={commandsOpen} onOpenChange={setCommandsOpen} />
      <Toaster position="bottom-right" />
    </SidebarProvider>
  )
}
