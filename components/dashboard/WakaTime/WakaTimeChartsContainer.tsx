"use client";
import CardAnimationWrapper from "../../CardAnimationWrapper"; // Assumed path
import WakaTimeEditorsChart from "./WakaTimeEditorsChart";
import WakaTimeCategoriesChart from "./WakaTimeCategoriesChart";
import WakaTimeLanguagesChart from "./WakaTimeLanguagesChart";

interface ChartDataPoint {
  name: string;
  value: number;
}

interface WakaTimeChartsProps {
  loading: boolean;
  mergedEditorsData: ChartDataPoint[];
  categoriesData: ChartDataPoint[];
  filteredLanguages: any[]; // Assuming it's an array of WakaTime language objects
}

/**
 * Main container that organizes and renders the three distinct WakaTime chart components.
 */
export default function WakaTimeChartsContainer({
  loading,
  mergedEditorsData,
  categoriesData,
  filteredLanguages,
}: WakaTimeChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      {loading ? (
        <>
          {/* Skeleton Loaders */}
          <CardAnimationWrapper index={17} className="w-full"><div className="h-96 bg-gray-700 animate-pulse rounded-lg border border-gray-600"></div></CardAnimationWrapper>
          <CardAnimationWrapper index={18} className="w-full"><div className="h-96 bg-gray-700 animate-pulse rounded-lg border border-gray-600"></div></CardAnimationWrapper>
          <CardAnimationWrapper index={19} className="col-span-1 md:col-span-2 w-full"><div className="h-96 bg-gray-700 animate-pulse rounded-lg border border-gray-600"></div></CardAnimationWrapper>
        </>
      ) : (
        <>
          {/* Editors Chart Card (1 of 3) */}
          <WakaTimeEditorsChart mergedEditorsData={mergedEditorsData} />

          {/* Categories Chart Card (2 of 3) */}
          <WakaTimeCategoriesChart categoriesData={categoriesData} />

          {/* Top Languages Chart Card (3 of 3) - Spans two columns */}
          <WakaTimeLanguagesChart filteredLanguages={filteredLanguages} />
        </>
      )}
    </div>
  );
}
