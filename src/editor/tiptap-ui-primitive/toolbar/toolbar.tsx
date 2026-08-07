"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { Kbd, KbdGroup } from "@/editor/ui/kbd"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useComposedRef } from "../../hooks/use-composed-ref"
import { useMenuNavigation } from "../../hooks/use-menu-navigation"
import { parseShortcutKeys } from "../../lib/tiptap-utils"

const useToolbarNavigation = (toolbarRef: React.RefObject<HTMLDivElement | null>) => {
  const [items, setItems] = useState<HTMLElement[]>([])

  const collectItems = useCallback(() => {
    if (!toolbarRef.current) return []
    return Array.from(
      toolbarRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [role="button"]:not([disabled]), [tabindex="0"]:not([disabled])'
      )
    )
  }, [toolbarRef])

  useEffect(() => {
    const toolbar = toolbarRef.current
    if (!toolbar) return

    const updateItems = () => setItems(collectItems())

    updateItems()
    const observer = new MutationObserver(updateItems)
    observer.observe(toolbar, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [collectItems, toolbarRef])

  const { selectedIndex } = useMenuNavigation<HTMLElement>({
    containerRef: toolbarRef,
    items,
    orientation: "horizontal",
    onSelect: el => el.click(),
    autoSelectFirstItem: false
  })

  useEffect(() => {
    const toolbar = toolbarRef.current
    if (!toolbar) return

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (toolbar.contains(target)) target.setAttribute("data-focus-visible", "true")
    }

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (toolbar.contains(target)) target.removeAttribute("data-focus-visible")
    }

    toolbar.addEventListener("focus", handleFocus, true)
    toolbar.addEventListener("blur", handleBlur, true)

    return () => {
      toolbar.removeEventListener("focus", handleFocus, true)
      toolbar.removeEventListener("blur", handleBlur, true)
    }
  }, [toolbarRef])

  useEffect(() => {
    if (selectedIndex !== undefined && items[selectedIndex]) {
      items[selectedIndex].focus()
    }
  }, [selectedIndex, items])
}

export function Toolbar({ children, className, ref, ...props }: React.ComponentProps<"div">) {
  const toolbarRef = useRef<HTMLDivElement>(null)
  const composedRef = useComposedRef(toolbarRef, ref)
  useToolbarNavigation(toolbarRef)

  return (
    <TooltipProvider delay={300}>
      <div
        ref={composedRef}
        role="toolbar"
        aria-label="toolbar"
        className={cn(
          "flex items-center gap-1 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-lg outline-none",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </TooltipProvider>
  )
}

interface ToolbarTooltipProps {
  children: React.ReactNode
  label: string
  shortcut?: string
}

export function ToolbarTooltip({ children, label, shortcut }: ToolbarTooltipProps) {
  const keys = shortcut ? parseShortcutKeys({ shortcutKeys: shortcut }) : []

  return (
    <Tooltip>
      <TooltipTrigger render={children as React.ReactElement} />
      <TooltipContent side="top" sideOffset={8}>
        {label}
        {keys.length > 0 && (
          <KbdGroup>
            {keys.map((key, i) => (
              <Kbd key={i}>{key}</Kbd>
            ))}
          </KbdGroup>
        )}
      </TooltipContent>
    </Tooltip>
  )
}

export function ToolbarSeparator({ ref, ...props }: React.ComponentProps<typeof Separator>) {
  return <Separator ref={ref} orientation="vertical" className="mx-0.5 h-4.5" {...props} />
}
