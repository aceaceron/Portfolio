"use client";

import { motion } from "framer-motion";
import CardAnimationWrapper from "../../CardAnimationWrapper";

interface Props {
  uniqueYears: number[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
}

export default function GitHubYearSelector({
  uniqueYears,
  selectedYear,
  setSelectedYear,
}: Props) {
  const selectedYearIndex = uniqueYears.indexOf(selectedYear);

  if (uniqueYears.length === 0) return null;

  return (
    <CardAnimationWrapper index={5} className="mb-6 overflow-x-auto">
      <div className="relative flex justify-start min-w-max">
        <div className="relative flex bg-gray-800 rounded-full">
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
          {uniqueYears.map((year) => (
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
  );
}
