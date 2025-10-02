"use client";
import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import ChartGlareCard from "./WakaTimeChartGlareCard"; 
interface ChartDataPoint {
  name: string;
  value: number;
}

interface WakaTimeEditorsChartProps {
  mergedEditorsData: ChartDataPoint[];
}

/**
 * Renders the Editors (Pie) chart using ECharts.
 */
export default function WakaTimeEditorsChart({
  mergedEditorsData,
}: WakaTimeEditorsChartProps) {
  const editorsChartOptions = useMemo(() => ({
    tooltip: { trigger: "item", formatter: "{b}: {c}h" },
    legend: { orient: "vertical", left: "left", textStyle: { color: "#fff" } },
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
        },
        animationType: "scale",
        animationEasing: "elasticOut",
        animationDelay(idx: number) {
          return idx * 100;
        },
      },
    ],
    color: ["#FFD700", "#00BFFF", "#FF6347", "#32CD32", "#FF69B4", "#8A2BE2", "#FF4500"],
  }), [mergedEditorsData]);

  if (mergedEditorsData.length === 0) return null;

  return (
    <ChartGlareCard title="Editors" index={17}>
      <ReactECharts
        option={editorsChartOptions}
        style={{ height: "400px" }}
        opts={{ renderer: "canvas" }}
      />
    </ChartGlareCard>
  );
}
