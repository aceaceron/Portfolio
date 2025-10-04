// components/dashboard/ContributionCalendar.tsx (Modified)
"use client";

import CardAnimationWrapper from "../../CardAnimationWrapper";
import DashboardCard from "../../dashboard/DashboardCard";
import DashboardCardSkeleton from "../../dashboard/DashboardCardSkeleton";
import ContributionCalendar from "../ContributionCalendar";
import { formatBestContributionDate } from "./utils";

interface Props {
  github: any;
  loading: boolean;
  yearLoading: boolean;
  selectedYear: number;
}

export default function GitHubStatsGrid({
  github,
  loading,
  yearLoading,
  selectedYear,
}: Props) {
  // Determine if the calendar card is ready and fully loaded
  const calendarReady = !loading && !yearLoading;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
      {loading ? (
        <DashboardCardSkeleton />
      ) : (
        <CardAnimationWrapper index={6} className="h-full">
          <DashboardCard
            title="Total Repositories"
            value={github?.totalRepositories || 0}
            description="Public and Private"
            animate={loading}
            className="h-full"
          />
        </CardAnimationWrapper>
      )}

      {loading || yearLoading ? (
        <DashboardCardSkeleton />
      ) : (
        <CardAnimationWrapper index={4} className="h-full">
          <DashboardCard
            title="Total Contributions"
            value={
              github?.contributionsCollection?.contributionCalendar
                ?.totalContributions || 0
            }
            description={`Contributions in ${selectedYear}`}
            animate={loading || yearLoading}
            className="h-full"
          />
        </CardAnimationWrapper>
      )}

      {loading || yearLoading ? (
        <DashboardCardSkeleton />
      ) : (
        <CardAnimationWrapper index={7} className="h-full">
          <DashboardCard
            title="Best Contribution in a Day"
            value={
              github?.bestContributionInADay
                ? github.bestContributionInADay
                    .split(" on ")[0]
                    .replace(" contributions", "")
                : "—"
            }
            description={
              github?.bestContributionInADay
                ? formatBestContributionDate(github.bestContributionInADay)
                : ""
            }
            animate={loading || yearLoading}
            className="h-full"
          />
        </CardAnimationWrapper>
      )}

      <CardAnimationWrapper
        index={8}
        className="p-4 bg-gray-800 rounded-lg col-span-1 md:col-span-3"
      >
        {(loading || yearLoading) && (
          <div className="animate-pulse h-[200px] md:h-[300px]" />
        )}
        {/* Pass the calendarReady flag as the shouldAnimate prop */}
        {calendarReady &&
          github?.contributionsCollection?.contributionCalendar && (
            <ContributionCalendar
              calendar={github.contributionsCollection.contributionCalendar}
              shouldAnimate={calendarReady} 
            />
          )}
      </CardAnimationWrapper>
    </div>
  );
}