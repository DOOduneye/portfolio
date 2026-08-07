import type { ReactNode } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"

/**
 * The shell every admin section sits in: a fixed bar for what the page is and
 * the one thing you make here, then a single scrolling area for the content.
 * Pages differ in what they list, not in how they are framed.
 */
export function AdminPage({
  title,
  action,
  header,
  toolbar,
  children
}: {
  title: string
  action?: ReactNode
  /** Replaces the title row outright, for pages with a selection mode. */
  header?: ReactNode
  /** Sits between the bar and the content, for filtering what is already there. */
  toolbar?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex h-svh flex-col">
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-4 md:px-6">
        {/* On a phone the sidebar is a sheet that starts closed, so its own
            toggle is unreachable and the way back has to live out here. */}
        <SidebarTrigger className="-ml-1 text-subtle-foreground md:hidden" />
        {header ?? (
          <>
            <h1 className="text-sm font-medium text-foreground">{title}</h1>
            {action && <div className="ml-auto">{action}</div>}
          </>
        )}
      </header>

      {toolbar && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 px-4 pt-4 pb-3 md:px-6">
          {toolbar}
        </div>
      )}

      <div className={`min-h-0 flex-1 overflow-y-auto px-4 pb-6 md:px-6 ${toolbar ? "" : "pt-4"}`}>
        {children}
      </div>
    </div>
  )
}
