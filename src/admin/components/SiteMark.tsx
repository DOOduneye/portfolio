import { useEffect, useRef, useState } from "react"
import { LoaderCircle } from "lucide-react"
import { api, errorMessage, uploadImage } from "../api"

export function SiteMark({ onError }: { onError: (message: string) => void }) {
  const [url, setUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    api.admin.settings.favicon
      .query()
      .then(current => !cancelled && setUrl(current))
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const choose = async (file: File) => {
    setBusy(true)
    try {
      const uploaded = await uploadImage(file)
      await api.admin.settings.setFavicon.mutate({ url: uploaded })
      setUrl(uploaded)
      // The browser holds the old icon until the fixed path is fetched again.
      refreshTabIcon(uploaded)
    } catch (err) {
      onError(errorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <input
        ref={input}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
        onChange={event => {
          const file = event.target.files?.[0]
          if (file) void choose(file)
          event.target.value = ""
        }}
      />
      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={busy}
        title="Change the site icon"
        aria-label="Change the site icon"
        className="group relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted text-sm font-semibold text-foreground transition-colors hover:border-ring"
      >
        {busy ? (
          <LoaderCircle size={14} className="animate-spin text-muted-foreground" />
        ) : url ? (
          <img src={url} alt="" className="h-full w-full object-cover" />
        ) : (
          "D"
        )}
      </button>
    </>
  )
}

function refreshTabIcon(url: string): void {
  const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (link) link.href = `${url}?v=${Date.now()}`
}
