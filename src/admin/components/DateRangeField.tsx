import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { MONTHS, YEARS, type DateRange } from "../lib/dateRange"

export function DateRangeField({
  value,
  onChange
}: {
  value: DateRange
  onChange: (next: DateRange) => void
}) {
  const set = (patch: Partial<DateRange>) => onChange({ ...value, ...patch })

  return (
    <div className="flex flex-col gap-2.5">
      <div className="grid grid-cols-2 gap-2">
        <Part
          label="From"
          month={value.startMonth}
          year={value.startYear}
          onMonth={startMonth => set({ startMonth: startMonth ?? "" })}
          onYear={startYear => set({ startYear: startYear ?? "" })}
        />
        <Part
          label="To"
          month={value.endMonth}
          year={value.endYear}
          disabled={value.present}
          onMonth={endMonth => set({ endMonth: endMonth ?? "" })}
          onYear={endYear => set({ endYear: endYear ?? "" })}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <Switch
          checked={value.present}
          onCheckedChange={present => set({ present, endMonth: "", endYear: "" })}
        />
        Still here
      </label>
    </div>
  )
}

function Part({
  label,
  month,
  year,
  disabled,
  onMonth,
  onYear
}: {
  label: string
  month: string
  year: string
  disabled?: boolean
  onMonth: (value: string | null) => void
  onYear: (value: string | null) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-subtle-foreground">{label}</Label>
      <div className="flex gap-2">
        <Select value={month} onValueChange={onMonth} disabled={disabled}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map(item => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={year} onValueChange={onYear} disabled={disabled}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map(item => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
