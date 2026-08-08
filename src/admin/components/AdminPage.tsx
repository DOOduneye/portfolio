import type { ReactNode } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AdminPage({
  title,
  action,
  header,
  toolbar,
  wide = false,
  children
}: {
  title: string
  action?: ReactNode
  header?: ReactNode
  toolbar?: ReactNode
  wide?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex h-svh flex-col">
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-4 md:px-6">
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
        <div className={wide ? "" : "mx-auto w-full max-w-4xl"}>{children}</div>
      </div>
    </div>
  )
}
