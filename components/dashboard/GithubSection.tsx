"use client";

import GitHubHeader from "./Github/GitHubHeader";
import GitHubYearSelector from "./Github/GitHubYearSelector";
import GitHubStatsGrid from "./Github/GitHubStatsGrid";

interface GitHubSectionProps {
  github: any;
  loading: boolean;
  yearLoading: boolean;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  uniqueYears: number[];
}

export default function GitHubSection({
  github,
  loading,
  yearLoading,
  selectedYear,
  setSelectedYear,
  uniqueYears,
}: GitHubSectionProps) {
  return (
    <div>
      <GitHubHeader />
      {github?.totalRepositories && uniqueYears.length > 0 && (
        <GitHubYearSelector
          uniqueYears={uniqueYears}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
      )}
      <GitHubStatsGrid
        github={github}
        loading={loading}
        yearLoading={yearLoading}
        selectedYear={selectedYear}
      />
    </div>
  );
}
