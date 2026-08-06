import { useQuery } from "@tanstack/react-query"
import { NavLink, useLocation } from "react-router-dom"
import { ArrowUpRight, Briefcase, FileText, Layers, LogOut, Search } from "lucide-react"
import { api, signOut } from "../api"
import { SiteMark } from "./SiteMark"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator
} from "@/components/ui/sidebar"

const SECTIONS = [
  { to: "/admin/posts", label: "Posts", icon: FileText },
  { to: "/admin/projects", label: "Projects", icon: Layers },
  { to: "/admin/experiences", label: "Experience", icon: Briefcase }
]

export function AdminSidebar({ onOpenCommands }: { onOpenCommands: () => void }) {
  const { pathname } = useLocation()
  const posts = useQuery(api.admin.posts.list.queryOptions())
  const drafts = posts.data?.filter(post => post.status === "draft").length ?? 0

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2 px-1 py-0.5">
            <SiteMark />
            <span className="truncate text-sm font-medium text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              davidoduneye.com
            </span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Search" onClick={onOpenCommands}>
                <Search />
                <span>Search</span>
                <SidebarMenuBadge className="font-mono text-[0.6875rem] text-subtle-foreground">
                  ⌘K
                </SidebarMenuBadge>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarMenu>
            {SECTIONS.map(({ to, label, icon: Icon }) => (
              <SidebarMenuItem key={to}>
                <SidebarMenuButton
                  tooltip={label}
                  isActive={pathname.startsWith(to)}
                  render={<NavLink to={to} />}
                >
                  <Icon />
                  <span>{label}</span>
                </SidebarMenuButton>
                {to === "/admin/posts" && drafts > 0 && (
                  <SidebarMenuBadge>{drafts}</SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="View site" render={<a href="/" />}>
              <ArrowUpRight />
              <span>View site</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sign out" onClick={signOut}>
              <LogOut />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
