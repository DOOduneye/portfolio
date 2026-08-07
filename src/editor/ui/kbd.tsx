import { createContext, useContext } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

type KbdVariant = "default" | "plain"

const KbdVariantContext = createContext<KbdVariant>("default")

const kbdVariants = cva(
  [
    "pointer-events-none inline-flex h-5 select-none items-center justify-center gap-0.5 rounded font-sans font-medium [&_svg:not([class*='size-'])]:size-3",
    "text-subtle-foreground",
    "[[data-slot=tooltip-content]_&]:border-border [[data-slot=tooltip-content]_&]:bg-background/10"
  ],
  {
    variants: {
      variant: {
        default: "min-w-5 border border-border bg-muted px-1 text-[10px]",
        plain: "px-0.5 text-[12px]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const kbdGroupVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      default: "gap-1",
      plain: "gap-0 px-0.5"
    }
  },
  defaultVariants: {
    variant: "default"
  }
})

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  const variant = useContext(KbdVariantContext)

  return <kbd data-slot="kbd" className={cn(kbdVariants({ variant }), className)} {...props} />
}

function KbdGroup({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof kbdGroupVariants>) {
  return (
    <KbdVariantContext.Provider value={variant ?? "default"}>
      <div
        data-slot="kbd-group"
        className={cn(kbdGroupVariants({ variant }), className)}
        {...props}
      />
    </KbdVariantContext.Provider>
  )
}

export { Kbd, KbdGroup }
