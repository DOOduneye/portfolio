import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export interface Column {
  key: string
  label?: string
  className?: string
}

export function RecordsList<T>({
  loading,
  rows,
  columns,
  empty,
  children
}: {
  loading: boolean
  rows: T[]
  columns: Column[]
  empty: { icon: LucideIcon; title: string; description: string; action: ReactNode }
  children: (row: T, index: number) => ReactNode
}) {
  if (loading) return <RowsSkeleton columns={columns.length} />

  if (rows.length === 0) {
    const Icon = empty.icon
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon />
          </EmptyMedia>
          <EmptyTitle>{empty.title}</EmptyTitle>
          <EmptyDescription>{empty.description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>{empty.action}</EmptyContent>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {columns.map(column => (
            <TableHead key={column.key} className={column.className}>
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>{rows.map(children)}</TableBody>
    </Table>
  )
}

function RowsSkeleton({ columns }: { columns: number }) {
  return (
    <div className="divide-y divide-border/60 border-b border-border/60">
      {[0, 1, 2, 3].map(row => (
        <div key={row} className="flex h-11 items-center gap-6 px-3">
          <Skeleton className="h-3.5 w-52" />
          {columns > 3 && <Skeleton className="h-3 w-32" />}
          <Skeleton className="ml-auto h-3 w-24" />
        </div>
      ))}
    </div>
  )
}
