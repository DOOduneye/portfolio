import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

interface SkeletonsProps {
  count?: number
  skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>>
}

function Skeletons({ count = 3, skeleton: Skeleton }: SkeletonsProps) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} />
      ))}
    </>
  )
}

export { Skeleton, Skeletons }

