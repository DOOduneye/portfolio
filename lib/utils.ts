import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Experience } from "@/types/experience";
import { Project } from "@/types/project";

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
  // If no end date is provided, assume the experience is current
  if (!toDate) {
    return `${fromDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })} - Present`;
  }

  // If the start and end dates are the same, then in (my definition) the
  // experience is current
  if (fromDate.getTime() === toDate.getTime()) {
    return `${fromDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })} - Present`;
  }

  const diffInMonths =
    (toDate.getFullYear() - fromDate.getFullYear()) * 12 +
    (toDate.getMonth() - fromDate.getMonth());

  // If the difference in months is less than or equal to 1, then we can
  // just show the month and year
  if (diffInMonths <= 1) {
    return `${fromDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })}`;
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
 * If end dates are the same, it compares their start dates.
 * If start and end dates are the same, it considers them as present experiences.
 * @param a - The first experience
 * @param b - The second experience
 * @returns A number indicating the comparison result
 *        -1: a is less than b
 *        0: a is equal to b
 *        1: a is greater than b
 */
export function compareExperiences(a: Experience, b: Experience): number {
  const fromDateA = a.from.toDate();
  const fromDateB = b.from.toDate();

  const toDateA = a.to.toDate();
  const toDateB = b.to.toDate();

  // If both experiences are present, then compare their start dates
  if (fromDateA === toDateA && fromDateB === toDateB) {
    return fromDateB.getTime() - fromDateA.getTime();
  }

  // If one of the experiences is present, then it is greater than the other
  if (fromDateA === toDateA || fromDateB === toDateB) {
    return 1;
  }

  // If both experiences are not present, then compare their end dates
  return toDateB.getTime() - toDateA.getTime();
}

/**
 * Compares two projects based on their dates.
 * @param a - The first project
 * @param b - The second project
 * @returns A number indicating the comparison result
 */
export function compareProjects(a: Project, b: Project): number {

  const fromDateA = a.date.toDate();
  const fromDateB = b.date.toDate();

  return fromDateB.getTime() - fromDateA.getTime();
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