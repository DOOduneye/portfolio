import { Button as BaseButton, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type BaseButtonProps = React.ComponentProps<typeof BaseButton>

const SIZES = {
  icon: "icon",
  iconSm: "icon-sm",
  iconXs: "icon-xs",
  icon2xs: "icon-xs"
} as const

export type ButtonProps = Omit<BaseButtonProps, "size" | "onClick"> & {
  size?: BaseButtonProps["size"] | keyof typeof SIZES
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  "data-active"?: boolean
}

export function Button({ size, className, ...props }: ButtonProps) {
  const resolved = size && size in SIZES ? SIZES[size as keyof typeof SIZES] : size

  return (
    <BaseButton
      size={resolved as BaseButtonProps["size"]}
      className={cn("data-[active=true]:bg-muted data-[active=true]:text-foreground", className)}
      {...props}
    />
  )
}

export { buttonVariants }
