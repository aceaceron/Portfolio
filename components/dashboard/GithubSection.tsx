"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import CardAnimationWrapper, { childVariants } from "../CardAnimationWrapper";
import DashboardCard from "./DashboardCard";
import DashboardCardSkeleton from "./DashboardCardSkeleton";
import ContributionCalendar from "./ContributionCalendar";

interface GitHubSectionProps {
  github: any;
  loading: boolean;
  yearLoading: boolean;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  uniqueYears: number[];
}

function formatBestContributionDate(best?: string): string {
  if (!best) return "";
  const parts = best.split(" on ");
  if (parts.length < 2) return "";
  let dateText = parts[1].trim();
  dateText = dateText.replace(/^[A-Za-z]{3,9},?\s*/i, "");
  dateText = dateText.replace(/(\d+)(st|nd|rd|th)/i, "$1");
  let d = new Date(dateText);
  if (isNaN(d.getTime())) {
    const alt = dateText.replace(/,/g, " ").replace(/\s+/g, " ").trim();
    d = new Date(alt);
  }
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return dateText;
}

export default function GitHubSection({
  github,
  loading,
  yearLoading,
  selectedYear,
  setSelectedYear,
  uniqueYears,
}: GitHubSectionProps) {
  const selectedYearIndex = uniqueYears.indexOf(selectedYear);

  return (
    <div>
      <CardAnimationWrapper index={3} className="flex items-center gap-3 mb-1">
        <Github className="text-yellow-400 w-5 h-5" />
        <motion.h2 variants={childVariants} className="text-xl font-semibold">
          GitHub
        </motion.h2>
      </CardAnimationWrapper>

      <CardAnimationWrapper index={4}>
        <motion.p variants={childVariants} className="text-gray-400 mb-2">
          Track contributions, repositories, and activity on GitHub.
        </motion.p>
      </CardAnimationWrapper>

      {/* Year selector */}
      {github?.totalRepositories && uniqueYears.length > 0 && (
        <CardAnimationWrapper index={5} className="mb-6 overflow-x-auto">
          <div className="relative flex justify-start min-w-max">
            <div className="relative flex bg-gray-800 rounded-full">
              <motion.div
                layout
                className="absolute top-0 left-0 h-full bg-yellow-400 rounded-full shadow-md"
                initial={false}
                animate={{
                  x: selectedYearIndex * 60,
                  width: 60,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              {uniqueYears.map((year, idx) => (
                <button
                  key={year}
                  className="relative z-10 text-center py-2 font-semibold"
                  style={{ width: 60 }}
                  onClick={() => setSelectedYear(year)}
                >
                  <span
                    className={
                      selectedYear === year
                        ? "text-black"
                        : "text-gray-200 hover:text-white"
                    }
                  >
                    {year}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </CardAnimationWrapper>
      )}

      {/* Cards Grid */}
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

        <CardAnimationWrapper index={8} className="p-4 bg-gray-800 rounded-lg col-span-1 md:col-span-3">
          {(loading || yearLoading) && (
            <div className="animate-pulse h-[200px] md:h-[300px]" />
          )}
          {!loading &&
            !yearLoading &&
            github?.contributionsCollection?.contributionCalendar && (
              <ContributionCalendar
                calendar={github.contributionsCollection.contributionCalendar}
              />
            )}
        </CardAnimationWrapper>
      </div>
    </div>
  );
}
