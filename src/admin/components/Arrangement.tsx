import type { ReactNode } from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier
} from "@dnd-kit/core"
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, type LucideIcon } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface Arrangeable {
  id: number
  visible: number
}

export function Arrangement<T extends Arrangeable>({
  loading,
  items,
  empty,
  onReorder,
  onOpen,
  actions,
  children
}: {
  loading: boolean
  items: T[]
  empty: { icon: LucideIcon; title: string; description: string; action: ReactNode }
  onReorder: (ordered: T[]) => void
  onOpen: (item: T) => void
  actions: (item: T) => ReactNode
  children: (item: T) => ReactNode
}) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor)
  )

  if (loading) return <ArrangementSkeleton />

  if (items.length === 0) {
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

  const ids: UniqueIdentifier[] = items.map(item => item.id)

  const handleEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    onReorder(arrayMove(items, ids.indexOf(active.id), ids.indexOf(over.id)))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ol className="relative divide-y divide-border/60">
          {items.map(item => (
            <Row key={item.id} item={item} onOpen={() => onOpen(item)} actions={actions(item)}>
              {children(item)}
            </Row>
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  )
}

function Row<T extends Arrangeable>({
  item,
  onOpen,
  actions,
  children
}: {
  item: T
  onOpen: () => void
  actions: ReactNode
  children: ReactNode
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn(
        "group/row relative -mx-3 px-3 transition-colors",
        isDragging ? "z-10 rounded-lg bg-muted shadow-lg" : "hover:bg-muted/30",
        item.visible === 0 && "opacity-55"
      )}
    >
      <button
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label="Reorder"
        className="absolute top-1/2 left-[-1.65rem] hidden -translate-y-1/2 cursor-grab text-subtle-foreground opacity-0 transition-opacity group-hover/row:opacity-100 focus-visible:opacity-100 active:cursor-grabbing sm:block"
      >
        <GripVertical className="size-4" />
      </button>

      <button type="button" onClick={onOpen} className="block w-full py-5 pr-10 text-left">
        {children}
      </button>

      <div className="absolute top-4 right-0 opacity-0 transition-opacity group-hover/row:opacity-100 focus-within:opacity-100">
        {actions}
      </div>
    </li>
  )
}

function ArrangementSkeleton() {
  return (
    <div className="flex flex-col gap-9 py-5">
      {[0, 1, 2].map(row => (
        <div key={row} className="flex flex-col gap-2">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-3.5 w-full max-w-lg" />
          <Skeleton className="h-3 w-40" />
        </div>
      ))}
    </div>
  )
}
