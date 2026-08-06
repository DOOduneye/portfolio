import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react"
import type { Editor } from "@tiptap/react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, ArrowUpRight, Image as ImageIcon, Trash2 } from "lucide-react"
import { api, errorMessage, uploadImage, type RouterOutputs } from "../api"
import { PostEditor } from "../../editor/PostEditor"
import { parseDocument, readingMinutes, slugify, wordCount } from "../../editor/document"
import { ConfirmButton } from "../components/ConfirmButton"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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

  const [post, setPost] = useState<Post | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saveState, setSaveState] = useState<SaveState>("clean")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)

  // A ref: comparing against it must not itself schedule a render.
  const saved = useRef("")

  const titleField = useRef<HTMLTextAreaElement>(null)
  const summaryField = useRef<HTMLTextAreaElement>(null)
  const body = useRef<Editor | null>(null)

  useEffect(() => {
    let cancelled = false

    api.admin.posts.bySlug
      .query({ slug })
      .then(loaded => {
        if (cancelled) return
        const next: Draft = {
          title: loaded.title,
          excerpt: loaded.excerpt ?? "",
          content: loaded.content,
          coverImage: loaded.coverImage
        }
        saved.current = JSON.stringify(next)
        setPost(loaded)
        setDraft(next)
      })
      .catch(err => !cancelled && setError(errorMessage(err)))

    return () => {
      cancelled = true
    }
  }, [slug])

  const save = useCallback(
    async (next: Draft) => {
      const snapshot = JSON.stringify(next)
      setSaveState("saving")
      try {
        const updated = await api.admin.posts.update.mutate({
          slug,
          title: next.title.trim(),
          excerpt: next.excerpt.trim() || null,
          content: next.content,
          coverImage: next.coverImage
        })
        saved.current = snapshot
        setPost(updated)
        setError(null)
        // Anything typed while the request was in flight leaves the draft
        // ahead of the snapshot, and the autosave effect picks it up again.
        setSaveState(current => (current === "saving" ? "clean" : current))
      } catch (err) {
        setSaveState("failed")
        setError(errorMessage(err))
      }
    },
    [slug]
  )

  const dirty = Boolean(draft) && JSON.stringify(draft) !== saved.current
  const titleMissing = !draft?.title.trim()

  useEffect(() => {
    if (!draft || !dirty || titleMissing) return
    setSaveState("dirty")
    const timer = setTimeout(() => void save(draft), AUTOSAVE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [draft, dirty, titleMissing, save])

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
      if (draft && dirty && !titleMissing) void save(draft)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [draft, dirty, titleMissing, save])

  const stats = useMemo(() => {
    if (!draft) return null
    const document = parseDocument(draft.content)
    return { words: wordCount(document), minutes: readingMinutes(document) }
  }, [draft])

  const focusBody = () => focusEditor(body.current)

  const change = (patch: Partial<Draft>) => setDraft(current => current && { ...current, ...patch })

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true)
    setError(null)
    try {
      await fn()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const togglePublished = () =>
    run(async () => {
      if (draft && dirty && !titleMissing) await save(draft)
      const updated = await api.admin.posts.setStatus.mutate({
        slug,
        status: post?.status === "published" ? "draft" : "published"
      })
      setPost(updated)
    })

  const rename = () =>
    run(async () => {
      const nextSlug = slugify(draft?.title ?? "")
      if (!nextSlug || nextSlug === slug) return
      await api.admin.posts.rename.mutate({ slug, nextSlug })
      navigate(`/admin/posts/${nextSlug}`, { replace: true })
    })

  const remove = () =>
    run(async () => {
      await api.admin.posts.remove.mutate({ slug })
      navigate("/admin/posts")
    })

  const pickCover = (file: File) =>
    void (async () => {
      setUploadingCover(true)
      try {
        change({ coverImage: await uploadImage(file) })
      } catch (err) {
        setError(errorMessage(err))
      } finally {
        setUploadingCover(false)
      }
    })()

  if (!post || !draft) {
    return error ? (
      <Alert variant="destructive">
        <AlertTitle>{error}</AlertTitle>
      </Alert>
    ) : (
      <p className="text-sm text-subtle-foreground">Loading…</p>
    )
  }

  const published = post.status === "published"

  return (
    <div>
      {/* Sticky: on a long post the publish control should never scroll away. */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-background/85 px-8 py-3 backdrop-blur">
        <Link
          to="/admin/posts"
          className="-ml-2.5 inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft size={15} strokeWidth={2} />
          Posts
        </Link>

        <div className="flex items-center gap-3">
          {stats && stats.words > 0 && (
            <span className="font-mono text-xs text-subtle-foreground">
              {stats.words} words · {stats.minutes} min
            </span>
          )}
          <SaveIndicator state={saveState} />
          {!published && <Badge variant="outline">Draft</Badge>}
          {published && (
            <Button
              variant="outline"
              render={<a href={`/writing/${slug}`} target="_blank" rel="noopener noreferrer" />}
            >
              <ArrowUpRight data-icon="inline-start" />
              View
            </Button>
          )}
          <Button
            onClick={togglePublished}
            disabled={busy || (!published && titleMissing)}
            title={!published && titleMissing ? "Give the post a title first" : undefined}
          >
            {published ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </header>

      {/*
        The same measure as the published article. A wider column here would
        reflow every line on publish, which is the one thing a writing surface
        built on the reader's stylesheet must not do.
      */}
      <div className="mx-auto max-w-2xl px-6 pb-32 pt-12">
        {error && (
          <div className="mb-8">
            <Alert variant="destructive">
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          </div>
        )}

        <article>
          <CoverImage
            src={draft.coverImage}
            uploading={uploadingCover}
            onPick={pickCover}
            onRemove={() => change({ coverImage: null })}
          />

          <AutoTextarea
            ref={titleField}
            value={draft.title}
            onChange={title => change({ title })}
            onEnter={() => summaryField.current?.focus()}
            placeholder="Title"
            className="editorial w-full resize-none bg-transparent text-4xl font-semibold leading-tight tracking-tight text-foreground outline-none placeholder:text-subtle-foreground"
          />

          <AutoTextarea
            ref={summaryField}
            value={draft.excerpt}
            onChange={excerpt => change({ excerpt })}
            onEnter={focusBody}
            onBackspaceAtStart={() => focusEnd(titleField.current)}
            placeholder="Add a summary"
            className="editorial mt-4 w-full resize-none bg-transparent text-lg leading-relaxed text-muted-foreground outline-none placeholder:text-subtle-foreground"
          />

          <div className="mt-10">
            <PostEditor
              onReady={editor => (body.current = editor)}
              initialContent={post.content}
              onChange={content => change({ content })}
              onError={setError}
              onLeaveStart={() => focusEnd(summaryField.current)}
            />
          </div>
        </article>

        <Separator className="mt-16" />

        <footer className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 font-mono text-xs text-subtle-foreground">
            /writing/{slug}
            {!post.publishedAt && slugify(draft.title) !== slug && (
              <button
                onClick={rename}
                disabled={busy}
                className="ml-3 text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
              >
                Use the title
              </button>
            )}
            {post.publishedAt && <span className="ml-3">Fixed once published</span>}
          </div>
          <ConfirmButton
            label="Delete"
            confirmLabel="Delete permanently"
            icon={Trash2}
            onConfirm={remove}
            disabled={busy}
          />
        </footer>
      </div>
    </div>
  )
}

// Tiptap's focus command sets the selection but does not always move DOM
// focus out of the field that had it.
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

  const label = { dirty: "Unsaved", saving: "Saving", failed: "Could not save" }[state]
  const tone = state === "failed" ? "text-destructive" : "text-muted-foreground"

  return <span className={`font-mono text-xs ${tone}`}>{label}</span>
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
        <button
          onClick={() => input.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 font-mono text-xs text-subtle-foreground transition-colors hover:text-foreground"
        >
          {uploading ? <Spinner /> : <ImageIcon size={14} />}
          {uploading ? "Uploading…" : "Add a cover image"}
        </button>
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
        // A newline here would be dropped on render, so Enter moves on instead.
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
