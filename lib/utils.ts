import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateRange(fromDate: Date, toDate: Date | null) {

  if (!toDate) {
    return `${fromDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - Present`;
  }

  const fromYear = fromDate.getFullYear();
  const toYear = toDate.getFullYear();

  const date =
    fromYear !== toYear
      ? `${fromDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${toDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
      : `${fromDate.toLocaleDateString('en-US', { month: 'short' })} - ${toDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;

  return date;
}