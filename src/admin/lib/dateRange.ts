export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
]

export interface DateRange {
  startMonth: string
  startYear: string
  endMonth: string
  endYear: string
  present: boolean
}

const THIS_YEAR = new Date().getFullYear()

export const YEARS = Array.from({ length: 16 }, (_, index) => String(THIS_YEAR + 1 - index))

export const emptyRange: DateRange = {
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  present: false
}

export function formatRange(range: DateRange): string {
  const { startMonth, startYear, endMonth, endYear, present } = range
  if (!startMonth || !startYear) return ""

  if (present) return `${startMonth} ${startYear} - Present`
  if (!endMonth || !endYear) return `${startMonth} ${startYear}`
  if (startYear === endYear) return `${startMonth} - ${endMonth} ${endYear}`
  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`
}

export function parseRange(value: string): DateRange {
  const text = value.trim()
  if (!text) return emptyRange

  const present = /present/i.test(text)
  const months = text.match(/[A-Za-z]{3}/g) ?? []
  const years = text.match(/\d{4}/g) ?? []

  const first = months[0] ?? ""
  const second = months[1] ?? ""
  const startMonth = MONTHS.includes(first) ? first : ""
  const endMonth = MONTHS.includes(second) ? second : ""

  if (present) {
    return { startMonth, startYear: years[0] ?? "", endMonth: "", endYear: "", present: true }
  }

  const startYear = years[0] ?? ""
  const endYear = years[1] ?? startYear

  return { startMonth, startYear, endMonth, endYear, present: false }
}

export function isRangeComplete(range: DateRange): boolean {
  if (!range.startMonth || !range.startYear) return false
  return range.present || Boolean(range.endMonth && range.endYear)
}
