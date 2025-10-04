"use client";
import { motion } from "framer-motion";
import { Code2, Calendar, TrendingUp } from "lucide-react";
import DashboardCard from "../DashboardCard";
import DashboardCardSkeleton from "../DashboardCardSkeleton";
import CardAnimationWrapper from "../../CardAnimationWrapper"; // Assumed path for CardAnimationWrapper
import { childVariants } from "../../CardAnimationWrapper"; // Assumed path

interface WakaTimeCardsProps {
  waka: any;
  loading: boolean;
  wakaTimeRange: string;
  allTimeData: any;
  allTimeLoading: boolean;
}

/**
 * Renders the three primary statistic cards for WakaTime data.
 */
export default function WakaTimeCards({
  waka,
  loading,
  wakaTimeRange,
  allTimeData,
  allTimeLoading,
}: WakaTimeCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {loading ? (
        <>
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </>
      ) : (
        <>
          {/* Average Daily Card */}
          <CardAnimationWrapper index={13} className="h-full w-full">
            <DashboardCard
              title="Average Daily"
              value={waka?.data?.human_readable_daily_average || "—"}
              description="Coding time per day"
              icon={<TrendingUp className="w-5 h-5 text-yellow-400" />}
              className="h-full w-full"
            />
          </CardAnimationWrapper>

          {/* Total Coding Time Card */}
          <CardAnimationWrapper index={14} className="h-full w-full">
            <DashboardCard
              title="Total Coding Time"
              value={waka?.data?.human_readable_total || "—"}
              description={wakaTimeRange}
              icon={<Code2 className="w-5 h-5 text-blue-400" />}
              className="h-full w-full"
            />
          </CardAnimationWrapper>

          {/* Lifetime Coding Time Card */}
          <CardAnimationWrapper index={15} className="h-full w-full">
            <DashboardCard
              title="Lifetime Coding Time"
              value={allTimeLoading ? "Loading..." : allTimeData?.data?.text || "—"}
              description="Since joining WakaTime"
              icon={<Calendar className="w-5 h-5 text-green-400" />}
              className="h-full w-full"
            />
          </CardAnimationWrapper>
        </>
      )}
    </div>
  );
}
