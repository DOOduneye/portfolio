"use client"

import { createContext, useContext } from "react"

import type { MenuContextValue } from "./menu-types"

export const MenuContext = createContext<MenuContextValue>({
  isRootMenu: false,
  open: false
})

export const useMenuContext = (): MenuContextValue => {
  return useContext(MenuContext)
}
