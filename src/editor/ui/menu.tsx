import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { cva } from "class-variance-authority"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

type MenuRootProps = MenuPrimitive.Root.Props
const MenuRoot = MenuPrimitive.Root

type MenuTriggerProps = MenuPrimitive.Trigger.Props
const MenuTrigger = MenuPrimitive.Trigger

type MenuSubmenuRootProps = MenuPrimitive.SubmenuRoot.Props
const MenuSubmenuRoot = MenuPrimitive.SubmenuRoot

type MenuSubmenuTriggerProps = MenuPrimitive.SubmenuTrigger.Props
const MenuSubmenuTrigger = ({ className, ...props }: MenuSubmenuTriggerProps) => {
  return <MenuPrimitive.SubmenuTrigger className={cn(menuItemVariants(), className)} {...props} />
}

type MenuPortalProps = MenuPrimitive.Portal.Props
const MenuPortal = MenuPrimitive.Portal

type MenuPositionerProps = MenuPrimitive.Positioner.Props
const MenuPositioner = ({ className, sideOffset = 4, ...props }: MenuPositionerProps) => {
  return (
    <MenuPrimitive.Positioner
      className={cn("z-50 outline-hidden", className)}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

const menuPopupVariants = cva([
  "min-w-40 overflow-x-hidden overflow-y-auto rounded-xl border border-border bg-popover p-[5px] text-popover-foreground shadow-lg outline-hidden",
  "origin-[var(--transform-origin)] transition-[transform,scale,opacity]",
  "data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0",
  "data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0"
])

type MenuPopupProps = MenuPrimitive.Popup.Props
const MenuPopup = ({ className, ...props }: MenuPopupProps) => {
  return <MenuPrimitive.Popup className={cn(menuPopupVariants(), className)} {...props} />
}

const menuItemVariants = cva([
  "relative flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground outline-hidden select-none",
  "data-[highlighted]:bg-muted data-[highlighted]:text-foreground",
  "[&>svg]:-ml-0.5 [&>svg]:shrink-0 [&>svg:not([class*='size-'])]:size-4.5",
  "[&>svg:not([class*='text-'])]:text-subtle-foreground data-[highlighted]:[&>svg:not([class*='text-'])]:text-foreground",
  "[&>svg]:pointer-events-none",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
])

type MenuItemProps = MenuPrimitive.Item.Props
const MenuItem = ({ className, ...props }: MenuItemProps) => {
  return <MenuPrimitive.Item className={cn(menuItemVariants(), className)} {...props} />
}

type MenuSeparatorProps = MenuPrimitive.Separator.Props
const MenuSeparator = ({ className, ...props }: MenuSeparatorProps) => {
  return (
    <MenuPrimitive.Separator
      className={cn("-mx-[5px] my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

type MenuGroupProps = MenuPrimitive.Group.Props
const MenuGroup = MenuPrimitive.Group

const menuGroupLabelVariants = cva([
  "px-2 py-1.5 text-xs font-medium text-subtle-foreground",
  "cursor-default select-none"
])

type MenuGroupLabelProps = MenuPrimitive.GroupLabel.Props
const MenuGroupLabel = ({ className, ...props }: MenuGroupLabelProps) => {
  return <MenuPrimitive.GroupLabel className={cn(menuGroupLabelVariants(), className)} {...props} />
}

type MenuRadioGroupProps = MenuPrimitive.RadioGroup.Props
const MenuRadioGroup = MenuPrimitive.RadioGroup

type MenuRadioItemProps = MenuPrimitive.RadioItem.Props
const MenuRadioItem = ({ className, children, ...props }: MenuRadioItemProps) => {
  return (
    <MenuPrimitive.RadioItem className={cn(menuItemVariants(), className)} {...props}>
      <span className="grow">{children}</span>
      <span className="flex size-4 shrink-0 items-center justify-center">
        <MenuPrimitive.RadioItemIndicator className="flex items-center justify-center">
          <Check className="size-3.5" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
    </MenuPrimitive.RadioItem>
  )
}

type MenuCheckboxItemProps = MenuPrimitive.CheckboxItem.Props
const MenuCheckboxItem = ({ className, children, ...props }: MenuCheckboxItemProps) => {
  return (
    <MenuPrimitive.CheckboxItem
      className={cn(menuItemVariants(), "group/checkbox pr-2.5 pl-2", className)}
      {...props}
    >
      <span className="relative mr-2 flex size-4 shrink-0 items-center justify-center rounded-[25%] border border-border transition-colors duration-100 group-data-[checked]/checkbox:border-brand group-data-[checked]/checkbox:bg-brand">
        <MenuPrimitive.CheckboxItemIndicator className="flex items-center justify-center text-background">
          <Check className="size-3" />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

export {
  MenuCheckboxItem as CheckboxItem,
  MenuGroup as Group,
  MenuGroupLabel as GroupLabel,
  MenuItem as Item,
  menuGroupLabelVariants,
  menuItemVariants,
  menuPopupVariants,
  MenuPopup as Popup,
  MenuPortal as Portal,
  MenuPositioner as Positioner,
  MenuRadioGroup as RadioGroup,
  MenuRadioItem as RadioItem,
  MenuRoot as Root,
  MenuSeparator as Separator,
  MenuSubmenuRoot as SubmenuRoot,
  MenuSubmenuTrigger as SubmenuTrigger,
  MenuTrigger as Trigger
}

export type {
  MenuCheckboxItemProps as CheckboxItemProps,
  MenuGroupLabelProps as GroupLabelProps,
  MenuGroupProps as GroupProps,
  MenuItemProps as ItemProps,
  MenuPopupProps as PopupProps,
  MenuPortalProps as PortalProps,
  MenuPositionerProps as PositionerProps,
  MenuRadioGroupProps as RadioGroupProps,
  MenuRadioItemProps as RadioItemProps,
  MenuRootProps as RootProps,
  MenuSeparatorProps as SeparatorProps,
  MenuSubmenuRootProps as SubmenuRootProps,
  MenuSubmenuTriggerProps as SubmenuTriggerProps,
  MenuTriggerProps as TriggerProps
}
