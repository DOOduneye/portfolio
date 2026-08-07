import type { ReactNode } from "react"

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
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-6">
        {header ?? (
          <>
            <h1 className="text-sm font-medium text-foreground">{title}</h1>
            {action && <div className="ml-auto">{action}</div>}
          </>
        )}
      </header>

      {toolbar && (
        <div className="flex shrink-0 items-center gap-2 px-6 pt-4 pb-3">{toolbar}</div>
      )}

      <div className={`min-h-0 flex-1 overflow-y-auto px-6 pb-6 ${toolbar ? "" : "pt-4"}`}>
        {children}
      </div>
    </div>
  )
}
