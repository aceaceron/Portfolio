"use client";

import CardAnimationWrapper from "../../CardAnimationWrapper";
import DashboardCard from "../../dashboard/DashboardCard";
import DashboardCardSkeleton from "../../dashboard/DashboardCardSkeleton";
import CountUp from "react-countup";

interface Props {
  umami: any;
  loading: boolean;
}

export default function UmamiStatsGrid({ umami, loading }: Props) {
  const stats = [
    { title: "Page Views", value: umami?.websiteStats?.pageviews?.value || 0, desc: "Total page views" },
    { title: "Visitors", value: umami?.websiteStats?.visitors?.value || 0, desc: "Unique visitors" },
    { title: "Visits", value: umami?.websiteStats?.visits?.value || 0, desc: "All visits" },
    { title: "Countries", value: umami?.websiteStats?.countries?.value || 1, desc: "Visitor countries" },
    { title: "Events", value: umami?.websiteStats?.events?.value || 0, desc: "Tracked events" },
    { title: "Visit Duration", value: umami?.websiteStats?.avgDuration?.formatted || "0 min", desc: "Average time spent" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 auto-rows-fr">
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <DashboardCardSkeleton
              key={index}
              className="w-full h-full flex flex-col"
            />
          ))
        : stats.map((s, i) => (
            <CardAnimationWrapper key={i} index={18 + i}>
              <DashboardCard
                title={s.title}
                value={
                  typeof s.value === "number" ? (
                    <CountUp start={1} end={s.value} duration={2} separator="," />
                  ) : (
                    s.value
                  )
                }
                description={s.desc}
                className="w-full h-full flex flex-col"
              />
            </CardAnimationWrapper>
          ))}
    </div>
  );
}
