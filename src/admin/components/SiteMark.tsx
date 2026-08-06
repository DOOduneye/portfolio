import { useRef } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { LoaderCircle } from "lucide-react"
import { api, errorMessage, uploadImage } from "../api"

export function SiteMark({ onError }: { onError?: (message: string) => void } = {}) {
  const input = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const { data: url } = useQuery(api.admin.settings.favicon.queryOptions())

  const save = useMutation(
    api.admin.settings.setFavicon.mutationOptions({
      onSuccess: saved => {
        void queryClient.invalidateQueries(api.admin.settings.favicon.queryFilter())
        if (saved.url) refreshTabIcon(saved.url)
      },
      onError: err => onError?.(errorMessage(err))
    })
  )

  const upload = useMutation({
    mutationFn: uploadImage,
    onSuccess: uploaded => save.mutate({ url: uploaded }),
    onError: err => onError?.(errorMessage(err))
  })

  const busy = upload.isPending || save.isPending

  return (
    <>
      <input
        ref={input}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
        onChange={event => {
          const file = event.target.files?.[0]
          if (file) upload.mutate(file)
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
          <img src={url} alt="" width={32} height={32} className="h-full w-full object-cover" />
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
