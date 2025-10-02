"use client";

import { motion } from "framer-motion";
import CardAnimationWrapper, { childVariants } from "../../CardAnimationWrapper";
import ReactECharts from "echarts-for-react";
import { getCountryFlag, getCountryName, monthNames } from "./utils";

interface Props {
  umami: any;
  loading: boolean;
}

export default function UmamiCharts({ umami, loading }: Props) {
  const pageviewsData = umami?.pageviews || [];
  const sessionsData = umami?.sessions || [];
  const countriesData = umami?.websiteStats?.countries?.breakdown || [];

  const isDemo = !pageviewsData.length && !sessionsData.length;

  const demoPageviews = Array.from({ length: 10 }).map((_, i) => ({ x: `2025-0${i + 1}`, y: 1500 + i * 200 }));
  const demoSessions = Array.from({ length: 10 }).map((_, i) => ({ x: `2025-0${i + 1}`, y: 100 + i * 20 }));

  const pageviewsToUse = isDemo ? demoPageviews : pageviewsData;
  const sessionsToUse = isDemo ? demoSessions : sessionsData;

  const months = pageviewsToUse.map((d: any) => monthNames[parseInt(d.x.split("-")[1], 10) - 1]);

  const chartOptions = {
    textStyle: { fontFamily: "Verdana" },
    title: { text: isDemo ? "Demo Chart" : "Pageviews & Sessions", textStyle: { color: "white" } },
    tooltip: { trigger: "axis" },
    legend: { data: ["Pageviews", "Sessions"], top: 30, textStyle: { color: "white" } },
    grid: { top: 70, bottom: 40, left: 50, right: 20 },
    xAxis: { type: "category", data: months },
    yAxis: { type: "value" },
    series: [
      { name: "Sessions", type: "bar", stack: "total", data: sessionsToUse.map((d: any) => d.y), itemStyle: { color: "#3b82f6" } },
      { name: "Pageviews", type: "bar", stack: "total", data: pageviewsToUse.map((d: any, i: number) => d.y - sessionsToUse[i].y), itemStyle: { color: "#facc15" } },
    ],
  };

  const pieChartOptions = {
    textStyle: { fontFamily: "Verdana" },
    title: { text: "Visitors by Country", textStyle: { color: "white" } },
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
      textStyle: { color: "white" },
      formatter: (name: string) => `${getCountryFlag(name)} ${getCountryName(name)}`,
      itemGap: 10,
    },
    series: [
      {
        name: "Countries",
        type: "pie",
        radius: ["20%", "35%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 0, borderColor: "transparent", borderWidth: 0 },
        label: { show: true, formatter: (params: any) => `${getCountryFlag(params.name)} ${getCountryName(params.name)} (${params.percent}%)`, color: "white", fontSize: 12 },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: "bold" } },
        labelLine: { show: true },
        data: countriesData.map((c: any) => ({ value: c.count, name: c.name })),
      },
    ],
    media: [{ query: { maxWidth: 768 }, option: { legend: { orient: "vertical", bottom: 0, left: "center", textStyle: { color: "white" } } } }],
  };

  return (
    <>
      {!loading && countriesData.length > 0 && (
        <CardAnimationWrapper index={26}>
          <motion.div variants={childVariants} className="relative p-4 bg-gray-800 rounded-lg border border-gray-600 overflow-hidden group mb-4">
            <div className="radial-bg pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100" />
            <div className="relative z-10">
              <ReactECharts option={pieChartOptions} style={{ height: "400px" }} />
            </div>
          </motion.div>
        </CardAnimationWrapper>
      )}

      {!loading && pageviewsToUse.length > 0 && sessionsToUse.length > 0 && (
        <CardAnimationWrapper index={27}>
          <motion.div variants={childVariants} className="relative p-4 bg-gray-800 rounded-lg border border-gray-600 overflow-hidden group">
            <div className="radial-bg pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100" />
            <div className="relative z-10">
              <ReactECharts option={chartOptions} style={{ height: "400px" }} />
              {isDemo && <p className="text-center text-yellow-500 text-sm mt-2">This is a demo chart only.</p>}
            </div>
          </motion.div>
        </CardAnimationWrapper>
      )}
    </>
  );
}
