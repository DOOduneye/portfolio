import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Experience } from "@/types/experience";

/**
 * Tailwind CSS classnames generator
 * @param inputs - a list of classnames
 * @returns a string of Tailwind CSS classnames
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date range string based on provided start and end dates.
 * @param fromDate - The start date
 * @param toDate - The end date (nullable)
 * @returns A formatted string representing the date range
 */
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

/**
 * Compares two experiences based on their end dates.
 * @param a - The first experience
 * @param b - The second experience
 * @returns A number indicating the comparison result
 */
export function compareExperiences(a: Experience, b: Experience): number {
  const toDateA = a.to ? a.to.toDate() : new Date();
  const toDateB = b.to ? b.to.toDate() : new Date();

  return toDateB.getTime() - toDateA.getTime();
}

/**
 * Gets a key from an object.
 * @param item - The object to get the key from
 * @returns The key of the object
 */
type KeyGetter<T> = (item: T) => string | number;

/**
 * Groups items in an array by a specific key derived from a provided function.
 * @param array - The array of items to be grouped
 * @param getKey - A function to extract keys for grouping
 * @returns A record containing items grouped by their keys
 */
export function groupBy<T>(array: T[], getKey: KeyGetter<T>): Record<string | number, T[]> {
  return array.reduce((acc: Record<string | number, T[]>, element: T) => {
    const key = getKey(element);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(element);
    return acc;
  }, {});
}