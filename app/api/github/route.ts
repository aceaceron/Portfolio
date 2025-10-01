import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubContributions, ContributionDay } from "../../../lib/github.api";
import { formatDate, findBestContribution } from "../../../lib/github.utils";

export async function GET(req: NextRequest) {
  try {
    const username = "aceaceron";

    // Get year from query string, default to current year
    const url = new URL(req.url);
    const yearParam = url.searchParams.get("year");
    const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();

    const data = await fetchGitHubContributions(username, year);

    const weeks = data.contributionsCollection?.contributionCalendar?.weeks || [];
    const allContributionDays = weeks.flatMap((week: any) => week.contributionDays || []);

    const bestContribution = findBestContribution(allContributionDays);

    const bestContributionInADay = bestContribution
      ? `${bestContribution.contributionCount} contributions on ${formatDate(bestContribution.date)}`
      : null;

    return NextResponse.json({ ...data, bestContributionInADay });
  } catch (err) {
    console.error("GitHub API error:", err);
    return NextResponse.json({ error: "Failed to fetch GitHub contributions" }, { status: 500 });
  }
}
