import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

type FilterState = {
  category: string;
  year: string;
  status: string;
};

type FilterPanelProps = {
  showFilters: boolean;
  filters: FilterState;
  categories: string[];
  years: string[];
  statuses: string[];
  onFilterChange: (filters: FilterState) => void;
};

export default function FilterPanel({
  showFilters,
  filters,
  categories,
  years,
  statuses,
  onFilterChange,
}: FilterPanelProps) {
  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 flex flex-col md:flex-row gap-4"
        >
          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) =>
              onFilterChange({ ...filters, category: e.target.value })
            }
            className={`w-full px-3 py-2 rounded-lg bg-gray-900 text-white transition-all ${
              filters.category
                ? "border-2 border-[#FFD700]"
                : "border border-gray-600"
            }`}
          >
            <option
              value=""
              className={filters.category ? "italic text-yellow-400" : ""}
            >
              {filters.category ? "Remove Filter" : "Select Category"}
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            value={filters.year}
            onChange={(e) =>
              onFilterChange({ ...filters, year: e.target.value })
            }
            className={`w-full px-3 py-2 rounded-lg bg-gray-900 text-white transition-all ${
              filters.year
                ? "border-2 border-[#FFD700]"
                : "border border-gray-600"
            }`}
          >
            <option
              value=""
              className={filters.year ? "italic text-yellow-400" : ""}
            >
              {filters.year ? "Remove Filter" : "Select Year"}
            </option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) =>
              onFilterChange({ ...filters, status: e.target.value })
            }
            className={`w-full px-3 py-2 rounded-lg bg-gray-900 text-white transition-all ${
              filters.status
                ? "border-2 border-[#FFD700]"
                : "border border-gray-600"
            }`}
          >
            <option
              value=""
              className={filters.status ? "italic text-yellow-400" : ""}
            >
              {filters.status ? "Remove Filter" : "Select Status"}
            </option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </motion.div>
      )}
    </AnimatePresence>
  );
}