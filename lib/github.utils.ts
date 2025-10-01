import { ContributionDay } from "./github.api";

// Format a date to "Wed, Sep 3rd 2025"
export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const weekday = date.toLocaleString("default", { weekday: "short" });

  const suffix = (d: number) =>
    d > 3 && d < 21 ? "th" : [1, 2, 3].includes(d % 10) ? ["st", "nd", "rd"][(d % 10) - 1] : "th";

  return `${weekday}, ${month} ${day}${suffix(day)} ${year}`;
}

// Find the best contribution in a set of days
export function findBestContribution(days: ContributionDay[], requestedDate?: string, requestedCount?: number): ContributionDay | null {
  let best: ContributionDay | null = null;

  // Check if a specific requested day/count exists
  if (requestedDate && requestedCount !== undefined) {
    const requested = days.find(day => day.date === requestedDate && day.contributionCount === requestedCount);
    if (requested) return requested;
  }

  // Otherwise, find the day with the max contributions
  for (const day of days) {
    if (day.contributionCount > 0 && (!best || day.contributionCount > best.contributionCount)) {
      best = day;
    }
  }

  return best;
}
