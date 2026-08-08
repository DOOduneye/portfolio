import type { UseFloatingOptions } from "@floating-ui/react"
import type { PluginKey } from "@tiptap/pm/state"
import type { Editor, Range } from "@tiptap/react"
import type { SuggestionOptions } from "@tiptap/suggestion"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DefaultContext = any

type IconProps = React.SVGProps<SVGSVGElement>
type IconComponent = ({ className, ...props }: IconProps) => React.ReactElement

export interface SuggestionItem<T = DefaultContext> {
  title: string
  subtext?: string
  badge?: React.MemoExoticComponent<IconComponent> | React.FC<IconProps> | string
  group?: string
  keywords?: string[]
  context?: T
  onSelect: (props: { editor: Editor; range: Range; context?: T }) => void
}

export type SuggestionMenuRenderProps<T = DefaultContext> = {
  items: SuggestionItem<T>[]
  selectedIndex?: number
  setSelectedIndex: (index: number) => void
  onSelect: (item: SuggestionItem<T>) => void
}

export interface SuggestionMenuProps<T = DefaultContext> extends Omit<
  SuggestionOptions<SuggestionItem<T>>,
  "pluginKey" | "editor"
> {
  editor?: Editor | null
  floatingOptions?: Partial<UseFloatingOptions>
  selector?: string
  pluginKey?: string | PluginKey
  maxHeight?: number
  controlledItems?: SuggestionItem<T>[]
  onDismiss?: () => void
  children: (props: SuggestionMenuRenderProps<T>) => React.ReactNode
}
