import { useQuery } from "@tanstack/react-query"
import { NavLink, useLocation } from "react-router-dom"
import {
  ArrowUpRight,
  Briefcase,
  FileText,
  HardDrive,
  Layers,
  LogOut,
  MessageSquare,
  NotebookPen,
  Search,
  Terminal
} from "lucide-react"
import { api, signOut } from "../api"
import { SiteMark } from "./SiteMark"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger
} from "@/components/ui/sidebar"

const CONTENT = [
  { to: "/admin/posts", label: "Posts", icon: FileText },
  { to: "/admin/projects", label: "Projects", icon: Layers },
  { to: "/admin/experiences", label: "Experience", icon: Briefcase }
]

const MARGIN = [
  { href: "https://margin.davidoduneye.com", label: "Journal", icon: NotebookPen },
  { href: "https://chat.davidoduneye.com", label: "Chat", icon: MessageSquare },
  { href: "https://drive.davidoduneye.com", label: "Drive", icon: HardDrive },
  { href: "https://agent.davidoduneye.com", label: "Agent", icon: Terminal }
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
            <span className="group-data-[collapsible=icon]:hidden">
              <SiteMark />
            </span>
            <span className="truncate text-sm font-medium text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              davidoduneye.com
            </span>
            <SidebarTrigger className="ml-auto text-subtle-foreground group-data-[collapsible=icon]:ml-0" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Search" onClick={onOpenCommands}>
                  <Search />
                  <span>Search</span>
                  <SidebarMenuBadge className="font-mono text-[0.6875rem] text-subtle-foreground group-data-[collapsible=icon]:hidden">
                    ⌘K
                  </SidebarMenuBadge>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {CONTENT.map(({ to, label, icon: Icon }) => (
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
                    <SidebarMenuBadge className="group-data-[collapsible=icon]:hidden">
                      {drafts}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Margin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MARGIN.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    tooltip={label}
                    render={<a href={href} target="_blank" rel="noopener noreferrer" />}
                  >
                    <Icon />
                    <span>{label}</span>
                    <ArrowUpRight className="ml-auto size-3.5 text-subtle-foreground group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
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
