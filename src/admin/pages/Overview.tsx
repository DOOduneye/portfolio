import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api, errorMessage, type RouterOutputs } from "../api"
import { AdminPage } from "../components/AdminPage"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type OverviewData = RouterOutputs["admin"]["settings"]["overview"]

export function Overview() {
  const overview = useQuery(api.admin.settings.overview.queryOptions())

  useEffect(() => {
    if (overview.error) toast.error(errorMessage(overview.error))
  }, [overview.error])

  return (
    <AdminPage title="Overview">
      {overview.data !== undefined && <OverviewForm current={overview.data} />}
    </AdminPage>
  )
}

function OverviewForm({ current }: { current: OverviewData }) {
  const queryClient = useQueryClient()
  const [location, setLocation] = useState(current?.location ?? "")
  const [intro, setIntro] = useState(current?.intro ?? "")

  const save = useMutation(
    api.admin.settings.setOverview.mutationOptions({
      onSuccess: saved => {
        setLocation(saved.location)
        setIntro(saved.intro)
        void queryClient.invalidateQueries(api.admin.settings.overview.queryFilter())
        void queryClient.invalidateQueries(api.public.settings.overview.queryFilter())
      },
      onError: cause => toast.error(errorMessage(cause))
    })
  )

  const complete = location.trim().length > 0 && intro.trim().length > 0
  const changed = location !== (current?.location ?? "") || intro !== (current?.intro ?? "")

  return (
    <div className="flex max-w-xl flex-col gap-3.5">
      <Field>
        <FieldLabel>Location</FieldLabel>
        <Input
          value={location}
          onChange={event => setLocation(event.target.value)}
          placeholder="Boston, MA"
          maxLength={64}
        />
      </Field>
      <Field>
        <FieldLabel>Overview</FieldLabel>
        <Textarea
          value={intro}
          onChange={event => setIntro(event.target.value)}
          placeholder="Software engineer at Klaviyo…"
          rows={4}
          maxLength={600}
        />
      </Field>
      <div>
        <Button
          size="sm"
          disabled={!complete || !changed || save.isPending}
          onClick={() => save.mutate({ location: location.trim(), intro: intro.trim() })}
        >
          Save changes
        </Button>
      </div>
    </div>
  )
}
