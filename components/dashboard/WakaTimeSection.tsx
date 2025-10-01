"use client";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useState } from "react";
import CardAnimationWrapper, { childVariants } from "../../components/CardAnimationWrapper";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardCardSkeleton from "../../components/dashboard/DashboardCardSkeleton";
import ReactECharts from "echarts-for-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

interface WakaTimeSectionProps {
  waka: any;
  loading: boolean;
  wakaTimeRange: string;
}

export default function WakaTimeSection({ waka, loading, wakaTimeRange }: WakaTimeSectionProps) {
  const [editorsMousePosition, setEditorsMousePosition] = useState({ x: 0, y: 0 });
  const [languagesMousePosition, setLanguagesMousePosition] = useState({ x: 0, y: 0 });

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
        data: filteredLanguages.map((l: any) =>
          (l.total_seconds / 3600).toFixed(2)
        ),
        borderRadius: 10,
        barThickness: 10,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(255, 215, 0, 0.8)";
          const gradient = ctx.createLinearGradient(
            chartArea.left,
            0,
            chartArea.right,
            0
          );
          gradient.addColorStop(0, "#FFD700");
          gradient.addColorStop(0.5, "#FFC700");
          gradient.addColorStop(1, "#FFA500");
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
        enabled: false, 
    },
      datalabels: {
        display: true,
        anchor: "end",
        align: "end",
        color: "#fff",
        font: { weight: "bold", size: 12 },
        formatter: (v: any) => `${v}h`,
        offset: 4,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { display: false },
        min: 0,
        max: (() => {
          const data = filteredLanguages.map((l: any) => l.total_seconds / 3600);
          return Math.max(...data) * 1.3;
        })(),
      },
      y: {
        grid: { display: false },
        ticks: { color: "#fff", font: { size: 14, weight: "500" } },
      },
    },
  };

  const handleEditorsMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setEditorsMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleLanguagesMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setLanguagesMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div>
      <CardAnimationWrapper index={9}>
        <motion.hr variants={childVariants} className="border-t-2 border-yellow-400 mb-4" />
      </CardAnimationWrapper>
      <CardAnimationWrapper index={10} className="flex items-center gap-2 mb-1">
        <Clock className="text-yellow-400 w-5 h-5" />
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {loading ? (
          <>
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </>
        ) : (
          <>
            <CardAnimationWrapper index={13} className="h-full w-full">
              <DashboardCard
                title="Average Daily Coding Time"
                value={waka?.data?.human_readable_daily_average || "—"}
                description=""
                className="h-full w-full"
              />
            </CardAnimationWrapper>
            <CardAnimationWrapper index={14} className="h-full w-full">
              <DashboardCard
                title="Total Coding Time"
                value={waka?.data?.human_readable_total || "—"}
                description="All coding editors"
                className="h-full w-full"
              />
            </CardAnimationWrapper>
            {mergedEditorsData.length > 0 && (
              <CardAnimationWrapper
                index={15}
                className="col-span-1 md:col-span-2 w-full"
              >
                <motion.div
                  variants={childVariants}
                  className="relative p-4 bg-gray-800 rounded-lg border border-gray-600 overflow-hidden group"
                  onMouseMove={handleEditorsMouseMove}
                >
                  <div
                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(600px circle at ${editorsMousePosition.x}px ${editorsMousePosition.y}px, rgba(255, 215, 0, 0.15), transparent 40%)`,
                    }}
                  />
                  <div className="relative z-10">
                    <h3 className="font-semibold text-lg mb-2">Editors</h3>
                    <ReactECharts
                      option={editorsChartOptions}
                      style={{ height: "400px" }}
                      opts={{ renderer: "canvas" }}
                    />
                  </div>
                </motion.div>
              </CardAnimationWrapper>
            )}
            {filteredLanguages.length > 0 && (
              <CardAnimationWrapper
                index={16}
                className="col-span-1 md:col-span-2 w-full"
              >
                <motion.div
                  variants={childVariants}
                  className="relative p-4 bg-gray-800 rounded-lg border border-gray-600 overflow-hidden group"
                  onMouseMove={handleLanguagesMouseMove}
                >
                  <div
                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(600px circle at ${languagesMousePosition.x}px ${languagesMousePosition.y}px, rgba(255, 215, 0, 0.15), transparent 40%)`,
                    }}
                  />
                  <div className="relative z-10">
                    <h3 className="font-semibold text-lg mb-2">Top Languages</h3>
                    <div style={{ width: "100%" }}>
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
                                font: { size: window.innerWidth < 640 ? 10 : 12 },
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
                        height={filteredLanguages.length * 40}
                      />
                    </div>
                  </div>
                </motion.div>
              </CardAnimationWrapper>
            )}
          </>
        )}
      </div>
    </div>
  );
}