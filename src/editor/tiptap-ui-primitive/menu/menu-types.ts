"use client"

import type * as React from "react"
import type * as Ariakit from "@ariakit/react"
import type { MenuProviderProps } from "@ariakit/react"

export interface MenuItemProps extends Omit<Ariakit.MenuItemProps, "store"> {
  name?: string
  value?: string
}

export interface MenuContextValue {
  isRootMenu: boolean
  open: boolean
}

export interface MenuProps extends MenuProviderProps {
  trigger?: React.ReactNode
  onOpenChange?: MenuProviderProps["setOpen"]
}

export type MenuContentProps = React.ComponentProps<typeof Ariakit.Menu>
