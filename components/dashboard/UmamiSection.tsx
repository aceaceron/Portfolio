"use client";

import UmamiHeader from "./Umami/UmamiHeader";
import UmamiStatsGrid from "./Umami/UmamiStatsGrid";
import UmamiCharts from "./Umami/UmamiCharts";

interface UmamiSectionProps {
  umami: any;
  loading: boolean;
}

export default function UmamiSection({ umami, loading }: UmamiSectionProps) {
  return (
    <div>
      <UmamiHeader />
      <UmamiStatsGrid umami={umami} loading={loading} />
      <UmamiCharts umami={umami} loading={loading} />
      <hr className="border-yellow-400 my-4" />
    </div>
  );
}
