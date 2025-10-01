import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

type SearchBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onFocus: () => void;
};

export default function SearchBar({
  search,
  onSearchChange,
  onFocus,
}: SearchBarProps) {
  const searchBorderStyle = search
    ? "border-2 border-[#FFD700]"
    : "border border-gray-600";

  return (
    <div className="relative flex items-center">
      <Search className="absolute left-3 text-gray-400 w-5 h-5 pointer-events-none" />
      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={onFocus}
        className={`w-full pl-10 pr-10 py-2 rounded-lg bg-gray-900 text-white focus:outline-none focus:border-[#FFD700] transition-all ${searchBorderStyle}`}
      />
      <AnimatePresence>
        {search && (
          <motion.button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 flex items-center justify-center text-gray-400 hover:text-white"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}