"use client";

import { motion } from "framer-motion";
import CardAnimationWrapper, { childVariants } from "../../CardAnimationWrapper";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts"; // Import echarts for gradients
import { getCountryFlag, getCountryName, monthNames } from "./utils";

interface Props {
  umami: any;
  loading: boolean;
}

export default function UmamiCharts({ umami, loading }: Props) {
  const pageviewsData = umami?.pageviews || [];
  const countriesData = umami?.websiteStats?.countries?.breakdown || [];

  // Demo fallback if no data exists
  const isDemo = !pageviewsData.length;
  const demoPageviews = Array.from({ length: 10 }).map((_, i) => ({
    x: `2025-0${i + 1}-01`,
    y: 1500 + i * 200,
  }));

  const dataToUse = isDemo ? demoPageviews : pageviewsData;

  // Extract Month Names
  const months = dataToUse.map(
    (d: any) => monthNames[parseInt(d.x.split("-")[1], 10) - 1]
  );

  // Modern Bar Chart Options
  const barChartOption = {
    backgroundColor: "transparent",
    textStyle: { fontFamily: "Inter, sans-serif" }, // Modern font
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(17, 24, 39, 0.9)", // Dark background
      borderColor: "#374151",
      textStyle: { color: "#fff" },
      axisPointer: { type: "shadow" }, // Highlights the bar on hover
      formatter: "{b}: <br/> <b>{c}</b> Page Views",
    },
    grid: {
      top: 30,
      bottom: 30,
      left: 20,
      right: 20,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: months,
      axisLine: { show: false }, // Hide line
      axisTick: { show: false }, // Hide ticks
      axisLabel: {
        color: "#9ca3af", // Gray-400
        fontSize: 12,
        margin: 15,
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: true,
        lineStyle: {
          color: "#374151", // Subtle grid lines
          type: "dashed",
          opacity: 0.5,
        },
      },
      axisLabel: { show: false }, // Minimalist: Hide Y-axis numbers (optional, remove if you want numbers)
    },
    series: [
      {
        name: "Page Views",
        type: "bar",
        barWidth: "40%", // Sleeker bars
        data: dataToUse.map((d: any) => d.y),
        itemStyle: {
          borderRadius: [6, 6, 0, 0], // Rounded top corners
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#22d3ee" }, // Cyan-400
            { offset: 1, color: "#3b82f6" }, // Blue-500
          ]),
        },
        // Add subtle glow shadow
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(34, 211, 238, 0.5)",
          },
        },
      },
    ],
  };

  // Pie Chart Options (Unchanged)
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
    legend: { show: false },
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
          formatter: (params: any) =>
            `${getCountryFlag(params.name)} ${getCountryName(params.name)} (${
              params.percent
            }%)`,
          color: "white",
          fontSize: 12,
        },
        emphasis: {
          label: { show: true, fontSize: 16, fontWeight: "bold" },
        },
        labelLine: { show: true },
        data: countriesData.map((c: any) => ({ value: c.count, name: c.name })),
      },
    ],
  };

  return (
    <>
      {/* Country Pie Chart */}
      {!loading && countriesData.length > 0 && (
        <CardAnimationWrapper index={26}>
          <motion.div
            variants={childVariants}
            className="relative p-4 bg-gray-800 rounded-lg border border-gray-600 overflow-hidden group mb-8"
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

      {/* Page Views Bar Chart */}
      {!loading && dataToUse.length > 0 && (
        <CardAnimationWrapper index={27}>
          <motion.div
            variants={childVariants}
            className="relative p-6 bg-gray-800 rounded-lg border border-gray-600 overflow-hidden group mb-8"
          >
            <div className="radial-bg pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold text-lg">
                  Monthly Page Views
                </h3>
                {isDemo && (
                  <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                    Demo Data
                  </span>
                )}
              </div>
              <ReactECharts
                option={barChartOption}
                style={{ height: "300px" }}
              />
            </div>
          </motion.div>
        </CardAnimationWrapper>
      )}
    </>
  );
}