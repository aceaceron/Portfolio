"use client";
import { useMemo } from "react";
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
import ChartGlareCard from "./WakaTimeChartGlareCard";

// Register Chart.js components once for the Bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

interface WakaTimeLanguage {
  name: string;
  total_seconds: number;
  // ... other properties
}

interface WakaTimeLanguagesChartProps {
  filteredLanguages: WakaTimeLanguage[];
}

/**
 * Renders the Top Languages (Horizontal Bar) chart using Chart.js.
 */
export default function WakaTimeLanguagesChart({
  filteredLanguages,
}: WakaTimeLanguagesChartProps) {
  const languageChartData = useMemo(() => ({
    labels: filteredLanguages.map((l) => l.name),
    datasets: [
      {
        label: "Hours",
        data: filteredLanguages.map((l) =>
          (l.total_seconds / 3600).toFixed(2)
        ),
        borderRadius: 10,
        barThickness: 10,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(255, 215, 0, 0.8)";
          const gradient = ctx.createLinearGradient(
            chartArea.left, 0, chartArea.right, 0
          );
          gradient.addColorStop(0, "#FFD700");
          gradient.addColorStop(0.5, "#FFC700");
          gradient.addColorStop(1, "#FFA500");
          return gradient;
        },
      },
    ],
  }), [filteredLanguages]);

  const languageChartOptions: any = useMemo(() => ({
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
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
        // Calculate max based on data for scaling
        max: (() => {
          const data = filteredLanguages.map((l) => l.total_seconds / 3600);
          return Math.max(...data) * 1.3;
        })(),
      },
      y: {
        grid: { display: false },
        ticks: { color: "#fff", font: { size: 14, weight: "500" } },
      },
    },
  }), [filteredLanguages]);

  // Dynamic height calculation for the bar chart
  const dynamicHeight = filteredLanguages.length * 40;

  if (filteredLanguages.length === 0) return null;
  
  return (
    <ChartGlareCard
      title="Top Languages"
      index={19}
      className="col-span-1 md:col-span-2 w-full"
    >
      <div style={{ width: "100%", height: dynamicHeight }}>
        <Bar
          data={languageChartData}
          options={{
            ...languageChartOptions,
            // Inline options for responsive font sizing (client-side only logic)
            scales: {
              x: {
                ...languageChartOptions.scales.x,
                ticks: {
                  ...languageChartOptions.scales.x.ticks,
                  font: { size: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 12 },
                },
              },
              y: {
                ...languageChartOptions.scales.y,
                ticks: {
                  ...languageChartOptions.scales.y.ticks,
                  font: { size: typeof window !== 'undefined' && window.innerWidth < 640 ? 10 : 14 },
                },
              },
            },
          }}
          height={dynamicHeight}
        />
      </div>
    </ChartGlareCard>
  );
}
