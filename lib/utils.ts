import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats the difference between a start date and today into a human-readable string.
 * Example: "1 year, 3 months, and 20 days"
 */
export function formatJobSearchDateString(startDate: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  if (start > today) {
    return '0 days';
  }

  let years = 0;
  let months = 0;
  let days = 0;

  let currentDate = new Date(start);
  while (true) {
    const nextYear = new Date(currentDate);
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    if (nextYear > today) {
      break;
    }

    years++;
    currentDate = nextYear;
  }

  while (true) {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    if (nextMonth > today) {
      break;
    }

    months++;
    currentDate = nextMonth;
  }

  days = Math.floor((today.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  }

  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  }

  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  }

  if (parts.length === 0) {
    return '0 days';
  }

  if (parts.length === 1) {
    return parts[0];
  } else if (parts.length === 2) {
    return `${parts[0]} and ${parts[1]}`;
  } else {
    return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
  }
}
