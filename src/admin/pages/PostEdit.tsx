import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Image as ImageIcon, LoaderCircle, Trash2 } from "lucide-react"
import { api, errorMessage, uploadImage, type RouterOutputs } from "../api"
import { PostEditor } from "../../editor/PostEditor"
import { parseDocument, readingMinutes, slugify, wordCount } from "../../editor/document"
import { ConfirmButton, ghostButton, primaryButton, StatusBadge } from "../components/ui"

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

  // What the server currently holds. A ref because comparing against it must
  // not itself schedule a render.
  const saved = useRef("")

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

  // Closing the tab mid-sentence should not silently drop the last edit.
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
    return error ? <ErrorBox message={error} /> : <p className="text-sm text-subtle">Loading…</p>
  }

  const published = post.status === "published"

  return (
    <div className="pb-24">
      <header className="flex items-center justify-between gap-4">
        <Link to="/admin/posts" className="text-sm text-subtle transition-colors hover:text-muted">
          ← Posts
        </Link>

        <div className="flex items-center gap-3">
          <SaveIndicator state={titleMissing && dirty ? "needsTitle" : saveState} />
          {stats && stats.words > 0 && (
            <span className="font-mono text-xs text-subtle">
              {stats.words} words · {stats.minutes} min
            </span>
          )}
          <StatusBadge status={post.status} />
          {published && (
            <a
              href={`/writing/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={ghostButton}
            >
              View
            </a>
          )}
          <button onClick={togglePublished} disabled={busy} className={primaryButton}>
            {published ? "Unpublish" : "Publish"}
          </button>
        </div>
      </header>

      {error && <ErrorBox message={error} />}

      <article className="mt-10">
        <CoverImage
          src={draft.coverImage}
          uploading={uploadingCover}
          onPick={pickCover}
          onRemove={() => change({ coverImage: null })}
        />

        <AutoTextarea
          value={draft.title}
          onChange={title => change({ title })}
          placeholder="Title"
          className="w-full resize-none bg-transparent text-4xl font-semibold leading-tight tracking-tight text-fg placeholder-subtle outline-none"
        />

        <AutoTextarea
          value={draft.excerpt}
          onChange={excerpt => change({ excerpt })}
          placeholder="Add a short standfirst, shown in the index and in previews"
          className="mt-3 w-full resize-none bg-transparent text-lg leading-relaxed text-muted placeholder-subtle outline-none"
        />

        <div className="mt-8">
          <PostEditor
            initialContent={post.content}
            onChange={content => change({ content })}
            onError={setError}
          />
        </div>
      </article>

      <footer className="mt-16 space-y-4 border-t border-line pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 font-mono text-xs text-subtle">
            <span className="text-muted">/writing/{slug}</span>
            {!post.publishedAt && slugify(draft.title) !== slug && (
              <button
                onClick={rename}
                disabled={busy}
                className="ml-3 text-accent transition-opacity hover:opacity-80"
              >
                match to title
              </button>
            )}
          </div>
          <ConfirmButton
            label="Delete post"
            confirmLabel="Delete for good"
            onConfirm={remove}
            disabled={busy}
          />
        </div>
        {post.publishedAt && (
          <p className="font-mono text-xs text-subtle">
            The URL is fixed once a post has been published.
          </p>
        )}
      </footer>
    </div>
  )
}

function SaveIndicator({ state }: { state: SaveState | "needsTitle" }) {
  const label = {
    clean: "Saved",
    dirty: "Unsaved",
    saving: "Saving…",
    failed: "Not saved",
    needsTitle: "Needs a title"
  }[state]

  const tone = state === "failed" || state === "needsTitle" ? "text-danger" : "text-subtle"

  return <span className={`font-mono text-xs ${tone}`}>{label}</span>
}

function ErrorBox({ message }: { message: string }) {
  return (
    <p className="mt-5 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
      {message}
    </p>
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
          <img src={src} alt="" className="w-full rounded-xl border border-line" />
          <button
            onClick={onRemove}
            aria-label="Remove cover image"
            className="absolute right-3 top-3 rounded-lg bg-page/80 p-2 text-muted opacity-0 backdrop-blur transition-opacity hover:text-danger group-hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => input.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 font-mono text-xs text-subtle transition-colors hover:text-accent"
        >
          {uploading ? (
            <LoaderCircle size={14} className="animate-spin" />
          ) : (
            <ImageIcon size={14} />
          )}
          {uploading ? "Uploading…" : "Add a cover image"}
        </button>
      )}
    </div>
  )
}

/** Grows with its content so a long title wraps instead of scrolling sideways. */
function AutoTextarea({
  value,
  onChange,
  placeholder,
  className
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  className: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    element.style.height = "auto"
    element.style.height = `${element.scrollHeight}px`
  }, [value])

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      placeholder={placeholder}
      onChange={event => onChange(event.target.value)}
      // A newline in a title or standfirst would be dropped on render anyway.
      onKeyDown={event => event.key === "Enter" && event.preventDefault()}
      className={className}
    />
  )
}
