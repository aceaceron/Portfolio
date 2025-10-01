"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardCardSkeleton from "../../components/dashboard/DashboardCardSkeleton";
import ContributionCalendar from "../../components/dashboard/ContributionCalendar";
import { Bar } from "react-chartjs-2";
import ReactECharts from "echarts-for-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Github, Clock, BarChart } from "lucide-react";
import CardAnimationWrapper, { childVariants } from "../../components/CardAnimationWrapper";
import * as echarts from "echarts/core";
import "echarts-gl"; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

// helper (put this somewhere above your component or inside the component)
function formatBestContributionDate(best?: string): string {
  if (!best) return "";
  const parts = best.split(" on ");
  if (parts.length < 2) return "";
  // e.g. parts[1] === "Wed, Sep 3rd 2025"
  let dateText = parts[1].trim();
  // 1) remove leading weekday and comma if present, e.g. "Wed, " or "Wednesday, "
  dateText = dateText.replace(/^[A-Za-z]{3,9},?\s*/i, "");
  // 2) remove ordinal suffixes from the day (1st, 2nd, 3rd, 4th -> 1,2,3,4)
  dateText = dateText.replace(/(\d+)(st|nd|rd|th)/i, "$1");
  // try parsing
  let d = new Date(dateText);
  // fallback: try removing extra commas and parse again
  if (isNaN(d.getTime())) {
    const alt = dateText.replace(/,/g, " ").replace(/\s+/g, " ").trim();
    d = new Date(alt);
  }
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }); // -> "September 3, 2025"
  }
  // final fallback: return the raw (cleaned) string if parsing fails
  return dateText;
}

// Helper functions
const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
const getLastSevenDayRange = () => {
  const today = new Date();
  const endDate = new Date(today);
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 6);
  return `${formatDate(startDate)}-${formatDate(endDate)}`;
};

export default function LiveDashboardPage() {
  const [loading, setLoading] = useState(true); // full page loading
  const [github, setGithub] = useState<any>(null);
  const [waka, setWaka] = useState<any>(null);
  const [umami, setUmami] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [yearLoading, setYearLoading] = useState(false); // only dashboard card loading
  const [wakaTimeRange, setWakaTimeRange] = useState("");
  const startYear = 2023;

  // compute uniqueYears above inside your component
  const uniqueYears: number[] = [
    startYear,
    ...(github?.repositories || []).map((r: { createdAt: string }) =>
      new Date(r.createdAt).getFullYear()
    ),
  ]
    .filter((year: number) => year >= startYear)
    .filter(
      (year: number, idx: number, arr: number[]) => arr.indexOf(year) === idx
    ) // Sort in reverse: newest to oldest
    .sort((a: number, b: number) => b - a);

  const selectedYearIndex = uniqueYears.indexOf(selectedYear);

  // Fetch full initial data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [ghRes, wkRes, umRes] = await Promise.all([
          fetch("/api/github").then((r) => (r.ok ? r.json() : null)),
          fetch("/api/wakatime").then((r) => (r.ok ? r.json() : null)),
          fetch("/api/umami").then((r) => (r.ok ? r.json() : null)),
        ]);
        setGithub(ghRes);
        setWaka(wkRes);
        setUmami(umRes);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Fetch GitHub dashboard cards only when year changes
  useEffect(() => {
    async function fetchGithubYear() {
      setYearLoading(true);
      try {
        const res = await fetch(`/api/github?year=${selectedYear}`);
        const data = await res.json();
        setGithub((prev: any) => ({ ...prev, ...data })); // merge only new GitHub data
      } finally {
        setYearLoading(false);
      }
    }
    if (!loading) fetchGithubYear(); // avoid double fetch on initial load
  }, [selectedYear, loading]);

  useEffect(() => {
    async function fetchGithubYear() {
      setYearLoading(true); // only year change
      try {
        const res = await fetch(`/api/github?year=${selectedYear}`);
        const data = await res.json();
        setGithub(data);
      } finally {
        setYearLoading(false);
      }
    }
    fetchGithubYear();
  }, [selectedYear]);

  useEffect(() => {
    fetch("/api/github")
      .then((res) => res.json())
      .then((data) => setGithub(data));
  }, []);

  useEffect(() => {
    setWakaTimeRange(getLastSevenDayRange());
    async function fetchData() {
      setLoading(true);
      try {
        const [ghRes, wkRes, umRes] = await Promise.all([
          fetch("/api/github")
            .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
            .catch(() => null),
          fetch("/api/wakatime")
            .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
            .catch(() => null),
          fetch("/api/umami")
            .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
            .catch(() => null),
        ]);
        setGithub(ghRes);
        setWaka(wkRes);
        setUmami(umRes);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Editors Donut Chart — show hours instead of percent
  const mergedEditorsData = (waka?.data?.editors || []).map((ed: any) => ({
    name: ed.name,
    value: +(ed.total_seconds / 3600).toFixed(2),
  }));
const editorsChartOptions = {
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c}h",
  },
  legend: {
    orient: "vertical",
    left: "left",
    textStyle: { color: "#fff" },
  },
  series: [
    {
      name: "Editors",
      type: "pie",
      radius: ["25%", "50%"],
      data: mergedEditorsData,
      label: {
        color: "#fff",
        fontWeight: "bold",
        formatter: "{b}: {c}h",
      },
      itemStyle: {
        borderRadius: 10,
        borderColor: "#222",
        borderWidth: 2,
        shadowBlur: 20,
        shadowColor: "rgba(0, 0, 0, 0.5)",
      },
      emphasis: {
        scale: true,
        scaleSize: 10,
        itemStyle: {
          shadowBlur: 30,
          shadowColor: "rgba(0, 0, 0, 0.7)",
        },
        label: {
          fontSize: 16,
          fontWeight: "bold",
        },
      },
      animationType: "scale",
      animationEasing: "elasticOut",
      animationDelay(idx: number) {
        return idx * 100;
      },
    },
  ],
  color: [
    "#FFD700",
    "#00BFFF",
    "#FF6347",
    "#32CD32",
    "#FF69B4",
    "#8A2BE2",
    "#FF4500",
  ],
};


  const filteredLanguages = (waka?.data?.languages || []).filter(
    (l: any) => l.name.toLowerCase() !== "other"
  );

const languageChartData = {
  labels: filteredLanguages.map((l: any) => l.name),
  datasets: [
    {
      label: "Hours",
      data: filteredLanguages.map((l: any) => (l.total_seconds / 3600).toFixed(2)),
      borderRadius: 10,
      barThickness: 10,
      backgroundColor: (context: any) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;

        if (!chartArea) return "rgba(255, 215, 0, 0.8)"; // fallback

        const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
        gradient.addColorStop(0, "#FFD700"); // light gold
        gradient.addColorStop(0.5, "#FFC700"); // medium gold
        gradient.addColorStop(1, "#FFA500"); // dark gold
        return gradient;
      },
    },
  ],
};


  const languageChartOptions: any = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#1f2937",
        titleColor: "#FFD700",
        bodyColor: "#fff",
      },
      datalabels: {
        anchor: "end",
        align: "end",
        color: "#fff",
        font: { weight: "bold", size: 12 },
        formatter: (v: any) => `${v}h`,
        offset: 0,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { display: false },
        min: 0,
        max: (() => {
          const data = filteredLanguages.map(
            (l: any) => l.total_seconds / 3600
          );
          return Math.max(...data) * 1.3;
        })(),
      },
      y: {
        grid: { display: false },
        ticks: { color: "#fff", font: { size: 14, weight: "500" } },
      },
    },
  };

  return (
    <div className="md:ml-64 px-8 pb-12">
      <DashboardHeader loading={loading} />
      <div className="space-y-8">
        {/* GitHub Section */}
        <div>
          <CardAnimationWrapper index={0} className="flex items-center gap-3 mb-1">
            <Github className="text-yellow-400 w-5 h-5" />
            <motion.h2 variants={childVariants} className="text-xl font-semibold">
              GitHub
            </motion.h2>
          </CardAnimationWrapper>
          
          <CardAnimationWrapper index={1}>
            <motion.p variants={childVariants} className="text-gray-400 mb-2">
              Track contributions, repositories, and activity on GitHub.
            </motion.p>
          </CardAnimationWrapper>

          {/* Year selector */}
          {github?.totalRepositories && uniqueYears.length > 0 && (
            <CardAnimationWrapper index={2} className="mb-6 overflow-x-auto">
              <div className="relative flex justify-start min-w-max">
                <div className="relative flex bg-gray-800 rounded-full">
                  {/* Animated indicator */}
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
                  {/* Year Buttons */}
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
              {/* Total Repositories */}
              {loading ? (
                <DashboardCardSkeleton />
              ) : (
                <CardAnimationWrapper index={3} className="h-full">
                  <DashboardCard
                    title="Total Repositories"
                    value={github?.totalRepositories || 0}
                    description="Public and Private"
                    animate={loading}
                    className="h-full"
                  />
                </CardAnimationWrapper>
              )}

              {/* Total Contributions */}
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

              {/* Best Contribution in a Day */}
              {loading || yearLoading ? (
                <DashboardCardSkeleton />
              ) : (
                <CardAnimationWrapper index={5} className="h-full">
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

              {/* Contribution Calendar */}
              <CardAnimationWrapper index={6} className="p-4 bg-gray-800 rounded-lg col-span-1 md:col-span-3">
                {(loading || yearLoading) && (
                  <div className="animate-pulse h-[200px] md:h-[300px]" />
                )}
                {!loading &&
                  !yearLoading &&
                  github?.contributionsCollection?.contributionCalendar && (
                    <ContributionCalendar
                      calendar={
                        github.contributionsCollection.contributionCalendar
                      }
                    />
                  )}
              </CardAnimationWrapper>
            </div>
          </div>

{/* WakaTime Section */}
<div>
  <CardAnimationWrapper index={7}>
    <motion.hr variants={childVariants} className="border-t-2 border-yellow-400 mb-4" />
  </CardAnimationWrapper>

  <CardAnimationWrapper index={8} className="flex items-center gap-2 mb-1">
    <Clock className="text-yellow-400 w-5 h-5" />
    <motion.h2 variants={childVariants} className="text-xl font-semibold">
      WakaTime
    </motion.h2>
  </CardAnimationWrapper>

  <CardAnimationWrapper index={9}>
    <motion.p variants={childVariants} className="text-gray-400 mb-2">
      Monitor coding activity and track productivity over time.
    </motion.p>
  </CardAnimationWrapper>

  <CardAnimationWrapper index={10}>
    <motion.p variants={childVariants} className="text-yellow-400 text-sm mb-2">
      {wakaTimeRange}
    </motion.p>
  </CardAnimationWrapper>

  {/* Cards Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
    {loading ? (
      <>
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
      </>
    ) : (
      <>
        {/* Average Daily Coding Time */}
        <CardAnimationWrapper index={11} className="h-full w-full">
          <DashboardCard
            title="Average Daily Coding Time"
            value={waka?.data?.human_readable_daily_average || "—"}
            description=""
            className="h-full w-full"
          />
        </CardAnimationWrapper>

        {/* Total Coding Time */}
        <CardAnimationWrapper index={12} className="h-full w-full">
          <DashboardCard
            title="Total Coding Time"
            value={waka?.data?.human_readable_total || "—"}
            description="All coding editors"
            className="h-full w-full"
          />
        </CardAnimationWrapper>

        {/* Editors Donut Chart */}
        {mergedEditorsData.length > 0 && (
          <CardAnimationWrapper
            index={13}
            className="p-4 bg-gray-800 rounded-lg border border-gray-600 col-span-1 md:col-span-2 w-full"
          >
            <motion.h3 variants={childVariants} className="font-semibold text-lg mb-2">
              Editors
            </motion.h3>
            <motion.div variants={childVariants}>
              <ReactECharts
                option={editorsChartOptions}
                style={{ height: "400px" }}
                opts={{ renderer: "canvas" }}
              />
            </motion.div>
          </CardAnimationWrapper>
        )}

{/* Top Languages Chart */}
{filteredLanguages.length > 0 && (
  <CardAnimationWrapper
    index={14}
    className="p-4 bg-gray-800 rounded-lg border border-gray-600 col-span-1 md:col-span-2 w-full"
  >
    <motion.h3 variants={childVariants} className="font-semibold text-lg mb-2">
      Top Languages
    </motion.h3>
    <motion.div variants={childVariants} style={{ width: "100%" }}>
      <Bar
        data={languageChartData}
        options={{
          ...languageChartOptions,
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: "y",
          plugins: {
            ...languageChartOptions.plugins,
          },
          scales: {
            x: {
              ...languageChartOptions.scales.x,
              ticks: {
                ...languageChartOptions.scales.x.ticks,
                font: { size: window.innerWidth < 640 ? 10 : 12 }, // smaller fonts on mobile
              },
            },
            y: {
              ...languageChartOptions.scales.y,
              ticks: {
                ...languageChartOptions.scales.y.ticks,
                font: { size: window.innerWidth < 640 ? 10 : 14 },
              },
            },
          },
        }}
        height={filteredLanguages.length * 40} // adjust height dynamically
      />
    </motion.div>
  </CardAnimationWrapper>
)}

      </>
    )}
  </div>
</div>


        {/* Umami Section */}
        <div>
          <CardAnimationWrapper index={15}>
            <motion.hr variants={childVariants} className="border-t-2 border-yellow-400 mb-4" />
          </CardAnimationWrapper>

          <CardAnimationWrapper index={16} className="flex items-center gap-2 mb-1">
            <BarChart className="text-yellow-400 w-5 h-5" />
            <motion.h2 variants={childVariants} className="text-xl font-semibold">
              Umami
            </motion.h2>
          </CardAnimationWrapper>

          <CardAnimationWrapper index={17}>
            <motion.p variants={childVariants} className="text-gray-400 mb-2">
              Website analytics to see pageviews, visitors, and traffic trends.
            </motion.p>
          </CardAnimationWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <DashboardCardSkeleton />
            ) : (
              <CardAnimationWrapper index={18}>
                <DashboardCard
                  title="Pageviews"
                  value={umami?.pageviews || 0}
                  description={`Unique visitors: ${umami?.visitors || 0}`}
                />
              </CardAnimationWrapper>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}