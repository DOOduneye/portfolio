"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import * as Ariakit from "@ariakit/react"

import type { MenuContentProps, MenuItemProps, MenuProps } from "."
import { MenuContext, useMenuContext } from "."
import { cn } from "@/lib/utils"
import { menuItemVariants, menuPopupVariants } from "@/editor/ui/menu"
import { useComposedRef } from "../../hooks/use-composed-ref"

export const MenuButton = Ariakit.MenuButton
export const MenuButtonArrow = Ariakit.MenuButtonArrow
export const MenuGroup = Ariakit.MenuGroup
export const MenuItemCheck = Ariakit.MenuItemCheck
export const MenuItemRadio = Ariakit.MenuItemRadio

export function Menu({ children, trigger, onOpenChange, ...props }: MenuProps) {
  const isRootMenu = !Ariakit.useMenuContext()
  const [open, setOpen] = useState<boolean>(false)

  const handleOpenChange = useCallback(
    (v: boolean) => {
      if (props.open === undefined) {
        setOpen(v)
      }
      onOpenChange?.(v)
    },
    [props.open, onOpenChange]
  )

  const menuContextValue = useMemo(
    () => ({
      isRootMenu,
      open: props.open ?? open
    }),
    [isRootMenu, props.open, open]
  )

  return (
    <Ariakit.MenuProvider open={open} setOpen={handleOpenChange} showTimeout={100} {...props}>
      {trigger}
      <MenuContext.Provider value={menuContextValue}>{children}</MenuContext.Provider>
    </Ariakit.MenuProvider>
  )
}

export function MenuContent({ children, className, ref, ...props }: MenuContentProps) {
  const menuRef = useRef<HTMLDivElement | null>(null)
  const { open } = useMenuContext()

  return (
    <Ariakit.Menu
      ref={useComposedRef(menuRef, ref)}
      className={cn(
        menuPopupVariants(),
        "z-50 min-w-[var(--popover-anchor-width)] origin-[var(--popover-transform-origin)]!",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-98 data-[state=open]:zoom-in-98",
        className
      )}
      data-state={open ? "open" : "closed"}
      gutter={4}
      flip
      {...props}
    >
      {children}
    </Ariakit.Menu>
  )
}

function renderMenuItem(
  htmlProps: React.HTMLAttributes<HTMLDivElement> & { "data-active-item"?: string }
) {
  const { "data-active-item": isActive, ...rest } = htmlProps
  return <div {...rest} data-highlighted={isActive !== undefined ? "" : undefined} />
}

export function MenuItem({ name, value, className, ...props }: MenuItemProps) {
  const itemClassName = cn(menuItemVariants(), className)

  if (name && value) {
    return (
      <Ariakit.MenuItemRadio
        {...props}
        render={renderMenuItem}
        hideOnClick
        name={name}
        value={value}
        className={itemClassName}
      />
    )
  }

  return <Ariakit.MenuItem {...props} render={renderMenuItem} className={itemClassName} />
}
