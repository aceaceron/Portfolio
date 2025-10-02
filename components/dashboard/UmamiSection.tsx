"use client";
import { motion } from "framer-motion";
import { BarChart } from "lucide-react";
import CardAnimationWrapper, {
  childVariants,
} from "../../components/CardAnimationWrapper";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardCardSkeleton from "../../components/dashboard/DashboardCardSkeleton";
import ReactECharts from "echarts-for-react";

interface UmamiSectionProps {
  umami: any;
  loading: boolean;
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Country code to flag emoji mapping
const countryFlags: Record<string, string> = {
  PH: "🇵🇭",
  US: "🇺🇸",
  BE: "🇧🇪",
  TH: "🇹🇭",
  GB: "🇬🇧",
  CA: "🇨🇦",
  AU: "🇦🇺",
  DE: "🇩🇪",
  FR: "🇫🇷",
  JP: "🇯🇵",
  KR: "🇰🇷",
  CN: "🇨🇳",
  IN: "🇮🇳",
  SG: "🇸🇬",
  MY: "🇲🇾",
  ID: "🇮🇩",
  VN: "🇻🇳",
  BR: "🇧🇷",
  MX: "🇲🇽",
  ES: "🇪🇸",
  IT: "🇮🇹",
  NL: "🇳🇱",
  SE: "🇸🇪",
  NO: "🇳🇴",
  DK: "🇩🇰",
  FI: "🇫🇮",
  PL: "🇵🇱",
  RU: "🇷🇺",
  TR: "🇹🇷",
  SA: "🇸🇦",
  AE: "🇦🇪",
  IL: "🇮🇱",
  EG: "🇪🇬",
  ZA: "🇿🇦",
  NG: "🇳🇬",
  KE: "🇰🇪",
  AR: "🇦🇷",
  CL: "🇨🇱",
  CO: "🇨🇴",
  PE: "🇵🇪",
  NZ: "🇳🇿",
  PT: "🇵🇹",
  CH: "🇨🇭",
  AT: "🇦🇹",
  IE: "🇮🇪",
  CZ: "🇨🇿",
  HU: "🇭🇺",
  RO: "🇷🇴",
};

function getCountryFlag(code: string): string {
  return countryFlags[code.toUpperCase()] || "🌍";
}

// Country code to full country name mapping
const countryNames: Record<string, string> = {
  PH: "Philippines",
  US: "United States",
  BE: "Belgium",
  TH: "Thailand",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  JP: "Japan",
  KR: "South Korea",
  CN: "China",
  IN: "India",
  SG: "Singapore",
  MY: "Malaysia",
  ID: "Indonesia",
  VN: "Vietnam",
  BR: "Brazil",
  MX: "Mexico",
  ES: "Spain",
  IT: "Italy",
  NL: "Netherlands",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  PL: "Poland",
  RU: "Russia",
  TR: "Turkey",
  SA: "Saudi Arabia",
  AE: "United Arab Emirates",
  IL: "Israel",
  EG: "Egypt",
  ZA: "South Africa",
  NG: "Nigeria",
  KE: "Kenya",
  AR: "Argentina",
  CL: "Chile",
  CO: "Colombia",
  PE: "Peru",
  NZ: "New Zealand",
  PT: "Portugal",
  CH: "Switzerland",
  AT: "Austria",
  IE: "Ireland",
  CZ: "Czech Republic",
  HU: "Hungary",
  RO: "Romania",
};

function getCountryName(code: string): string {
  return countryNames[code.toUpperCase()] || code; // fallback to code if not found
}

function formatDuration(seconds: number): string {
  if (seconds === 0) return "0s";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);

  return parts.join(", ");
}

export default function UmamiSection({ umami, loading }: UmamiSectionProps) {
  const demoPageviews = [
    { x: "2025-01", y: 1500 },
    { x: "2025-02", y: 1700 },
    { x: "2025-03", y: 2000 },
    { x: "2025-04", y: 2500 },
    { x: "2025-05", y: 2200 },
    { x: "2025-06", y: 1800 },
    { x: "2025-07", y: 1600 },
    { x: "2025-08", y: 1400 },
    { x: "2025-09", y: 1200 },
    { x: "2025-10", y: 1100 },
  ];

  const demoSessions = [
    { x: "2025-01", y: 100 },
    { x: "2025-02", y: 120 },
    { x: "2025-03", y: 150 },
    { x: "2025-04", y: 180 },
    { x: "2025-05", y: 160 },
    { x: "2025-06", y: 140 },
    { x: "2025-07", y: 130 },
    { x: "2025-08", y: 120 },
    { x: "2025-09", y: 110 },
    { x: "2025-10", y: 100 },
  ];

  const pageviewsData = umami?.pageviews?.length > 0 ? umami.pageviews : [];
  const sessionsData = umami?.sessions?.length > 0 ? umami.sessions : [];
  const isDemo = !umami?.pageviews?.length && !umami?.sessions?.length;

  const chartTitle = isDemo ? "Demo Chart" : "Pageviews & Sessions";
  const pageviewsDataToUse = isDemo ? demoPageviews : pageviewsData;
  const sessionsDataToUse = isDemo ? demoSessions : sessionsData;

  const months = pageviewsDataToUse.map(
    (d: any) => monthNames[parseInt(d.x.split("-")[1], 10) - 1]
  );

  const chartOptions = {
    textStyle: { fontFamily: "Verdana" },
    title: {
      text: chartTitle,
      textStyle: { color: "white" },
    },
    tooltip: { trigger: "axis" },
    legend: {
      data: ["Pageviews", "Sessions"],
      top: 30,
      textStyle: { color: "white" }, // legend text color
    },
    grid: {
      top: 70, // space for title
      bottom: 40, // space for x-axis labels
      left: 50, // space for y-axis labels
      right: 20,
    },
    xAxis: { type: "category", data: months },
    yAxis: { type: "value" },
    series: [
      {
        name: "Sessions",
        type: "bar",
        stack: "total",
        data: sessionsDataToUse.map((d: any) => d.y),
        itemStyle: { color: "#3b82f6" },
      },
      {
        name: "Pageviews",
        type: "bar",
        stack: "total",
        data: pageviewsDataToUse.map(
          (d: any, i: number) => d.y - sessionsDataToUse[i].y
        ),
        itemStyle: { color: "#facc15" },
      },
    ],
  };

  // Countries pie chart
  const countriesData = umami?.websiteStats?.countries?.breakdown || [];
  const hasCountries = countriesData.length > 0;

  // Update your pie chart series data:
  const pieChartOptions = {
    textStyle: { fontFamily: "Verdana" },
    title: {
      text: "Visitors by Country",
      textStyle: { color: "white" },
    },
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        const flag = getCountryFlag(params.name);
        const fullName = getCountryName(params.name);
        return `${flag} ${fullName}<br/>Visits: ${params.value} (${params.percent}%)`;
      },
    },
    legend: {
      orient: "horizontal",
      bottom: 0,
      left: "center",
      textStyle: { color: "white" }, // <--- legend text color
      formatter: (name: string) => {
        const flag = getCountryFlag(name);
        const fullName = getCountryName(name);
        return `${flag} ${fullName}`;
      },
      itemGap: 10,
    },
    series: [
      {
        name: "Countries",
        type: "pie",
        radius: ["20%", "35%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 0,
          borderColor: "transparent",
          borderWidth: 0,
        },
        label: {
          show: true,
          formatter: (params: any) => {
            const flag = getCountryFlag(params.name);
            const fullName = getCountryName(params.name);
            return `${flag} ${fullName} (${params.percent}%)`;
          },
          color: "white",
          fontWeight: "normal",
          fontSize: 12,
          textBorderColor: "transparent",
          textBorderWidth: 0,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
            textBorderColor: "transparent",
            textBorderWidth: 0,
          },
        },
        labelLine: { show: true },
        data: countriesData.map((country: any) => ({
          value: country.count,
          name: country.name,
        })),
      },
    ],
    media: [
      {
        query: { maxWidth: 768 }, // mobile breakpoint
        option: {
          legend: {
            orient: "vertical", // stack vertically
            bottom: 0,
            left: "center",
            textStyle: { color: "white" }, // <--- mobile legend text color
          },
        },
      },
    ],
  };

  return (
    <div>
      <CardAnimationWrapper index={18} className="flex items-center gap-2 mb-1">
        <BarChart className="text-yellow-400 w-5 h-5" />
        <motion.h2 variants={childVariants} className="text-xl font-semibold">
          Umami
        </motion.h2>
      </CardAnimationWrapper>

      <CardAnimationWrapper index={19}>
        <motion.p variants={childVariants} className="text-gray-400 mb-4">
          Analytics to see pageviews, visitors of my website portfolio.
        </motion.p>
      </CardAnimationWrapper>

      <CardAnimationWrapper index={19}>
        <motion.p variants={childVariants} className="text-yellow-400 text-sm mb-2">
          christianluisaceron.com
        </motion.p>
      </CardAnimationWrapper>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 auto-rows-fr">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <DashboardCardSkeleton
              key={index}
              className="w-full h-full flex flex-col"
            />
          ))
        ) : (
          <>
            <CardAnimationWrapper index={20}>
              <DashboardCard
                title="Page Views"
                value={umami?.websiteStats?.pageviews?.value || 0}
                description="Total page views"
                className="w-full h-full flex flex-col"
              />
            </CardAnimationWrapper>

            <CardAnimationWrapper index={21}>
              <DashboardCard
                title="Visitors"
                value={umami?.websiteStats?.visitors?.value || 0}
                description="Unique visitors"
                className="w-full h-full flex flex-col"
              />
            </CardAnimationWrapper>

            <CardAnimationWrapper index={22}>
              <DashboardCard
                title="Visits"
                value={umami?.websiteStats?.visits?.value || 0}
                description="All visits"
                className="w-full h-full flex flex-col"
              />
            </CardAnimationWrapper>

            <CardAnimationWrapper index={23}>
              <DashboardCard
                title="Countries"
                value={umami?.websiteStats?.countries?.value || 1}
                description="Visitor countries"
                className="w-full h-full flex flex-col"
              />
            </CardAnimationWrapper>

            <CardAnimationWrapper index={24}>
              <DashboardCard
                title="Events"
                value={umami?.websiteStats?.events?.value || 0}
                description="Tracked events"
                className="w-full h-full flex flex-col"
              />
            </CardAnimationWrapper>

            <CardAnimationWrapper index={25}>
              <DashboardCard
                title="Avg Visit Duration"
                value={umami?.websiteStats?.avgDuration?.formatted || "0 min"}
                description="Avg time per visit"
                className="w-full h-full flex flex-col"
              />
            </CardAnimationWrapper>
          </>
        )}
      </div>

      {/* Countries Pie Chart */}
      {!loading && hasCountries && (
        <CardAnimationWrapper index={26}>
          <motion.div
            variants={childVariants}
            className="relative p-4 bg-gray-800 rounded-lg border border-gray-600 overflow-hidden group  mb-4 "
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              e.currentTarget.querySelector<HTMLDivElement>(
                ".radial-bg"
              )!.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(255, 215, 0, 0.15), transparent 40%)`;
            }}
          >
            <div className="radial-bg pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100" />
            <div className="relative z-10">
              <ReactECharts
                option={pieChartOptions}
                style={{ height: "400px" }}
              />
            </div>
          </motion.div>
        </CardAnimationWrapper>
      )}

      {/* Pageviews & Sessions Chart */}
      {!loading &&
        pageviewsDataToUse.length > 0 &&
        sessionsDataToUse.length > 0 && (
          <CardAnimationWrapper index={27}>
            <motion.div
              variants={childVariants}
              className="relative p-4 bg-gray-800 rounded-lg border border-gray-600 overflow-hidden group"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.querySelector<HTMLDivElement>(
                  ".radial-bg"
                )!.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(255, 215, 0, 0.15), transparent 40%)`;
              }}
            >
              <div className="radial-bg pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100" />
              <div className="relative z-10">
                <ReactECharts
                  option={chartOptions}
                  style={{ height: "400px" }}
                />
                {isDemo && (
                  <p className="text-center text-yellow-500 text-sm mt-2">
                    This is a demo chart only.
                  </p>
                )}
              </div>
            </motion.div>
          </CardAnimationWrapper>
        )}

      <CardAnimationWrapper index={17}>
        <motion.hr
          variants={childVariants}
          className="border-t-2 border-yellow-400 mb-4 mt-4"
        />
      </CardAnimationWrapper>
    </div>
  );
}
