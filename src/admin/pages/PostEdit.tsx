import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Editor } from "@tiptap/react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  ArrowUpRight,
  Image as ImageIcon,
  MoreHorizontal,
  PenLine,
  Trash2
} from "lucide-react"
import { api, errorMessage, uploadImage, type RouterOutputs } from "../api"
import { PostEditor } from "../../editor/PostEditor"
import { parseDocument, readingMinutes, slugify, wordCount } from "../../editor/document"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"

type Post = RouterOutputs["admin"]["posts"]["bySlug"]

interface Draft {
  title: string
  excerpt: string
  content: string
  coverImage: string | null
}

type SaveState = "clean" | "dirty" | "saving" | "failed"

const AUTOSAVE_DELAY_MS = 1200

export function PostEdit() {
  const { slug = "" } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [draft, setDraft] = useState<Draft | null>(null)
  const [editorError, setEditorError] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const saved = useRef("")
  const inFlight = useRef("")

  const titleField = useRef<HTMLTextAreaElement>(null)
  const summaryField = useRef<HTMLTextAreaElement>(null)
  const body = useRef<Editor | null>(null)

  // The editor is the only writer, so a background refetch would only risk
  // overwriting what is being typed.
  const postQuery = useQuery({
    ...api.admin.posts.bySlug.queryOptions({ slug }),
    staleTime: Infinity,
    refetchOnWindowFocus: false
  })
  const post = postQuery.data

  const seeded = useRef<string | null>(null)
  useEffect(() => {
    if (!post || seeded.current === post.slug) return
    const next: Draft = {
      title: post.title,
      excerpt: post.excerpt ?? "",
      content: post.content,
      coverImage: post.coverImage
    }
    saved.current = JSON.stringify(next)
    seeded.current = post.slug
    setDraft(next)
  }, [post])

  const afterWrite = (updated: Post) => {
    queryClient.setQueryData(api.admin.posts.bySlug.queryKey({ slug: updated.slug }), updated)
    void queryClient.invalidateQueries(api.admin.posts.list.queryFilter())
  }

  const update = useMutation(
    api.admin.posts.update.mutationOptions({
      onSuccess: updated => {
        saved.current = inFlight.current
        afterWrite(updated)
      }
    })
  )
  const setStatus = useMutation(
    api.admin.posts.setStatus.mutationOptions({ onSuccess: afterWrite })
  )
  const rename = useMutation(
    api.admin.posts.rename.mutationOptions({
      onSuccess: renamed => {
        void queryClient.invalidateQueries(api.admin.posts.list.queryFilter())
        if (renamed) navigate(`/admin/posts/${renamed.slug}`, { replace: true })
      }
    })
  )
  const remove = useMutation(
    api.admin.posts.remove.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries(api.admin.posts.list.queryFilter())
        navigate("/admin/posts")
      }
    })
  )
  const uploadCover = useMutation({
    mutationFn: uploadImage,
    onSuccess: url => change({ coverImage: url })
  })

  const dirty = Boolean(draft) && JSON.stringify(draft) !== saved.current
  const titleMissing = !draft?.title.trim()
  const busy = setStatus.isPending || rename.isPending || remove.isPending

  const saveState: SaveState = update.isError
    ? "failed"
    : update.isPending
      ? "saving"
      : dirty
        ? "dirty"
        : "clean"

  const error =
    editorError ??
    postQuery.error ??
    update.error ??
    setStatus.error ??
    rename.error ??
    remove.error ??
    uploadCover.error

  const persist = useCallback(
    (next: Draft) => {
      inFlight.current = JSON.stringify(next)
      update.mutate({
        slug,
        title: next.title.trim(),
        excerpt: next.excerpt.trim() || null,
        content: next.content,
        coverImage: next.coverImage
      })
    },
    [slug, update]
  )

  useEffect(() => {
    if (!draft || !dirty || titleMissing) return
    const timer = setTimeout(() => persist(draft), AUTOSAVE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [draft, dirty, titleMissing, persist])

  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [dirty])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key !== "s") return
      event.preventDefault()
      if (draft && dirty && !titleMissing) persist(draft)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [draft, dirty, titleMissing, persist])

  const stats = useMemo(() => {
    if (!draft) return null
    const document = parseDocument(draft.content)
    return { words: wordCount(document), minutes: readingMinutes(document) }
  }, [draft])

  const focusBody = () => focusEditor(body.current)

  const change = (patch: Partial<Draft>) => setDraft(current => current && { ...current, ...patch })

  const togglePublished = () => {
    if (draft && dirty && !titleMissing) persist(draft)
    setStatus.mutate({ slug, status: post?.status === "published" ? "draft" : "published" })
  }

  const renameToTitle = () => {
    const nextSlug = slugify(draft?.title ?? "")
    if (!nextSlug || nextSlug === slug) return
    rename.mutate({ slug, nextSlug })
  }

  if (!post || !draft) {
    return error ? (
      <Alert variant="destructive">
        <AlertTitle>{errorMessage(error)}</AlertTitle>
      </Alert>
    ) : (
      <p className="text-sm text-subtle-foreground">Loading…</p>
    )
  }

  const published = post.status === "published"

  return (
    <div>
      <header className="sticky top-0 z-20 flex h-12 items-center gap-2 border-b border-border bg-background/85 px-4 backdrop-blur">
        <Link
          to="/admin/posts"
          className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Posts
        </Link>

        <div className="ml-auto flex items-center gap-2">
          {stats && stats.words > 0 && (
            <span className="font-mono text-xs tabular-nums text-subtle-foreground">
              {stats.words} words · {stats.minutes} min
            </span>
          )}
          <SaveIndicator state={saveState} />
          {!published && <Badge variant="outline">Draft</Badge>}
          {published && (
            <Button
              size="sm"
              variant="ghost"
              render={<a href={`/writing/${slug}`} target="_blank" rel="noopener noreferrer" />}
            >
              <ArrowUpRight data-icon="inline-start" />
              View
            </Button>
          )}
          <Button
            size="sm"
            onClick={togglePublished}
            disabled={busy || (!published && titleMissing)}
            title={!published && titleMissing ? "Give the post a title first" : undefined}
          >
            {published ? "Unpublish" : "Publish"}
          </Button>

          {/* The address and the destructive action are settings, not part of
              the document, so they live off the header rather than under it. */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-sm" aria-label="Post settings" />}
            >
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="font-mono text-xs font-normal text-subtle-foreground">
                /writing/{slug}
              </DropdownMenuLabel>
              {!post.publishedAt && slugify(draft.title) !== slug && (
                <DropdownMenuItem onClick={renameToTitle} disabled={busy}>
                  <PenLine />
                  Match the address to the title
                </DropdownMenuItem>
              )}
              {post.publishedAt && (
                <DropdownMenuItem disabled>The address is fixed once published</DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                disabled={busy}
                onClick={() => setConfirmingDelete(true)}
              >
                <Trash2 />
                Delete post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Dialog open={confirmingDelete} onOpenChange={setConfirmingDelete}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete this post?</DialogTitle>
            <DialogDescription>
              {draft.title.trim() || "This post"} and everything written in it goes away. This
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmingDelete(false)}>
              Keep it
            </Button>
            <Button variant="destructive" disabled={busy} onClick={() => remove.mutate({ slug })}>
              Delete post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mx-auto w-full max-w-2xl px-6 pb-32 pt-10">
        {error && (
          <div className="mb-8">
            <Alert variant="destructive">
              <AlertTitle>{errorMessage(error)}</AlertTitle>
            </Alert>
          </div>
        )}

        <article>
          <CoverImage
            src={draft.coverImage}
            uploading={uploadCover.isPending}
            onPick={file => uploadCover.mutate(file)}
            onRemove={() => change({ coverImage: null })}
          />

          <AutoTextarea
            ref={titleField}
            value={draft.title}
            onChange={title => change({ title })}
            onEnter={() => summaryField.current?.focus()}
            placeholder="Title"
            className="editorial w-full resize-none bg-transparent text-[1.875rem] font-semibold leading-[1.2] tracking-[-0.022em] text-foreground outline-none placeholder:text-subtle-foreground"
          />

          <AutoTextarea
            ref={summaryField}
            value={draft.excerpt}
            onChange={excerpt => change({ excerpt })}
            onEnter={focusBody}
            onBackspaceAtStart={() => focusEnd(titleField.current)}
            placeholder="Add a summary"
            className="editorial mt-2 w-full resize-none bg-transparent text-[0.9375rem] leading-relaxed text-muted-foreground outline-none placeholder:text-subtle-foreground"
          />

          <div className="mt-8">
            <PostEditor
              onReady={editor => (body.current = editor)}
              initialContent={post.content}
              onChange={content => change({ content })}
              onError={setEditorError}
              onLeaveStart={() => focusEnd(summaryField.current)}
            />
          </div>
        </article>
      </div>
    </div>
  )
}

function focusEditor(editor: Editor | null): void {
  if (!editor) return
  editor.view.dom.focus()
  editor.commands.focus("start")
}

function focusEnd(field: HTMLTextAreaElement | null): void {
  if (!field) return
  field.focus()
  field.setSelectionRange(field.value.length, field.value.length)
}

function SaveIndicator({ state }: { state: SaveState }) {
  if (state === "clean") return null

  const label = { dirty: "Unsaved", saving: "Saving…", failed: "Could not save" }[state]
  const tone = state === "failed" ? "text-destructive" : "text-muted-foreground"

  return (
    <span aria-live="polite" className={`font-mono text-xs ${tone}`}>
      {label}
    </span>
  )
}

function CoverImage({
  src,
  uploading,
  onPick,
  onRemove
}: {
  src: string | null
  uploading: boolean
  onPick: (file: File) => void
  onRemove: () => void
}) {
  const input = useRef<HTMLInputElement>(null)

  return (
    <div className="mb-8">
      <input
        ref={input}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp,image/avif"
        className="hidden"
        onChange={event => {
          const file = event.target.files?.[0]
          if (file) onPick(file)
          event.target.value = ""
        }}
      />

      {src ? (
        <div className="group relative">
          <img src={src} alt="" className="w-full rounded-xl border border-border" />
          <button
            onClick={onRemove}
            aria-label="Remove cover image"
            className="absolute right-3 top-3 rounded-lg bg-background/80 p-2 text-muted-foreground opacity-0 backdrop-blur transition-opacity hover:text-destructive group-hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ) : (
        // Mono is for data, not for actions, and the target was a 12px line of
        // text. This is a real button that reads as one.
        <Button
          variant="ghost"
          size="sm"
          onClick={() => input.current?.click()}
          disabled={uploading}
          className="-ml-2.5 text-muted-foreground"
        >
          {uploading ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <ImageIcon data-icon="inline-start" />
          )}
          {uploading ? "Uploading cover" : "Add cover"}
        </Button>
      )}
    </div>
  )
}

const AutoTextarea = forwardRef<
  HTMLTextAreaElement,
  {
    value: string
    onChange: (value: string) => void
    onEnter?: () => void
    onBackspaceAtStart?: () => void
    placeholder: string
    className: string
  }
>(function AutoTextarea(
  { value, onChange, onEnter, onBackspaceAtStart, placeholder, className },
  ref
) {
  const inner = useRef<HTMLTextAreaElement>(null)
  useImperativeHandle(ref, () => inner.current as HTMLTextAreaElement, [])

  useEffect(() => {
    const element = inner.current
    if (!element) return
    element.style.height = "auto"
    element.style.height = `${element.scrollHeight}px`
  }, [value])

  return (
    <textarea
      ref={inner}
      rows={1}
      value={value}
      placeholder={placeholder}
      onChange={event => onChange(event.target.value)}
      onKeyDown={event => {
        if (event.key === "Enter") {
          event.preventDefault()
          onEnter?.()
          return
        }
        const field = event.currentTarget
        const atStart = field.selectionStart === 0 && field.selectionEnd === 0
        if (event.key === "Backspace" && atStart && onBackspaceAtStart) {
          event.preventDefault()
          onBackspaceAtStart()
        }
      }}
      className={className}
    />
  )
})
