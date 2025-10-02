"use client";
import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import ChartGlareCard from "./WakaTimeChartGlareCard";

interface ChartDataPoint {
  name: string;
  value: number;
}

interface WakaTimeCategoriesChartProps {
  categoriesData: ChartDataPoint[];
}

/**
 * Renders the Categories (Pie) chart using ECharts.
 */
export default function WakaTimeCategoriesChart({
  categoriesData,
}: WakaTimeCategoriesChartProps) {
  const categoriesChartOptions = useMemo(() => ({
    tooltip: { trigger: "item", formatter: "{b}: {c}h ({d}%)" },
    legend: { orient: "vertical", left: "left", textStyle: { color: "#fff" } },
    series: [
      {
        name: "Categories",
        type: "pie",
        radius: ["25%", "50%"],
        data: categoriesData,
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
        },
        animationType: "scale",
        animationEasing: "elasticOut",
        animationDelay(idx: number) {
          return idx * 100;
        },
      },
    ],
    color: ["#4CAF50", "#2196F3", "#FF9800", "#E91E63", "#9C27B0"],
  }), [categoriesData]);

  if (categoriesData.length === 0) return null;

  return (
    <ChartGlareCard title="Categories" index={18}>
      <ReactECharts
        option={categoriesChartOptions}
        style={{ height: "400px" }}
        opts={{ renderer: "canvas" }}
      />
    </ChartGlareCard>
  );
}
