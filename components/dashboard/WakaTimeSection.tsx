"use client";
import { motion } from "framer-motion";
import { SiWakatime } from "react-icons/si";
import { useState, useEffect, useMemo } from "react";
import CardAnimationWrapper, { childVariants } from "../CardAnimationWrapper";
import WakaTimeCards from "./WakaTime/WakaTimeCards";

import WakaTimeCharts from "./WakaTime/WakaTimeChartsContainer";
interface WakaTimeSectionProps {
  waka: any;
  loading: boolean;
  wakaTimeRange: string;
}

/**
 * Main component for the WakaTime dashboard section.
 * Handles data fetching (all-time) and processing of data for child components.
 */
export default function WakaTimeSection({ waka, loading, wakaTimeRange }: WakaTimeSectionProps) {
  const [allTimeData, setAllTimeData] = useState<any>(null);
  const [allTimeLoading, setAllTimeLoading] = useState(true);

  // Fetch all-time data
  useEffect(() => {
    const fetchAllTime = async () => {
      try {
        const res = await fetch('/api/wakatime/all-time');
        const data = await res.json();
        if (!data.error) {
          setAllTimeData(data);
        }
      } catch (error) {
        console.error('Failed to fetch all-time data:', error);
      } finally {
        setAllTimeLoading(false);
      }
    };
    fetchAllTime();
  }, []);

  // --- Data Processing for Charts (moved from the original component) ---

  const mergedEditorsData = useMemo(() => {
    return (waka?.data?.editors || []).map((ed: any) => ({
      name: ed.name,
      value: +(ed.total_seconds / 3600).toFixed(2),
    }));
  }, [waka]);

  const categoriesData = useMemo(() => {
    return (waka?.data?.categories || []).map((cat: any) => ({
      name: cat.name,
      value: +(cat.total_seconds / 3600).toFixed(2),
    }));
  }, [waka]);

  const filteredLanguages = useMemo(() => {
    return (waka?.data?.languages || []).filter(
      (l: any) => l.name.toLowerCase() !== "other"
    );
  }, [waka]);


  return (
    <div>
      {/* Header and Introduction */}
      <CardAnimationWrapper index={9}>
        <motion.hr variants={childVariants} className="border-t-2 border-yellow-400 mb-4" />
      </CardAnimationWrapper>

      <CardAnimationWrapper index={10} className="flex items-center gap-2 mb-1">
        <SiWakatime className="text-yellow-400 w-5 h-5" />
        <motion.h2 variants={childVariants} className="text-xl font-semibold">
          WakaTime
        </motion.h2>
      </CardAnimationWrapper>

      <CardAnimationWrapper index={11}>
        <motion.p variants={childVariants} className="text-gray-400 mb-2">
          Monitor coding activity and track productivity over time.
        </motion.p>
      </CardAnimationWrapper>

      <CardAnimationWrapper index={12}>
        <motion.p variants={childVariants} className="text-yellow-400 text-sm mb-2">
          {wakaTimeRange}
        </motion.p>
      </CardAnimationWrapper>

      {/* Statistics Cards Component */}
      <WakaTimeCards
        waka={waka}
        loading={loading}
        wakaTimeRange={wakaTimeRange}
        allTimeData={allTimeData}
        allTimeLoading={allTimeLoading}
      />

      {/* Charts Component */}
      <WakaTimeCharts
        loading={loading}
        mergedEditorsData={mergedEditorsData}
        categoriesData={categoriesData}
        filteredLanguages={filteredLanguages}
      />
    </div>
  );
}
