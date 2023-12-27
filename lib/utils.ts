import { Experience } from "@/services/experiences";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateRange(fromDate: Date, toDate: Date | null) {
  if (!toDate) {
    return `${fromDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })} - Present`;
  }

  const fromYear = fromDate.getFullYear();
  const toYear = toDate.getFullYear();

  const date =
    fromYear !== toYear
      ? `${fromDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })} - ${toDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })}`
      : `${fromDate.toLocaleDateString("en-US", {
        month: "short",
      })} - ${toDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })}`;

  return date;
}

export function compareExperiences(a: Experience, b: Experience): number {
  const toDateA = a.to ? a.to.toDate() : new Date();
  const toDateB = b.to ? b.to.toDate() : new Date();

  return toDateB.getTime() - toDateA.getTime();
}
