import * as React from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import BackButton from "./BackButton";

type ProjectErrorStateProps = {
  error: string;
  onRefresh: () => void;
};

export default function ProjectErrorState({
  error,
  onRefresh,
}: ProjectErrorStateProps) {
  return (
    <div className="md:ml-64 px-6 pb-6 pt-0 flex flex-col items-center justify-center min-h-96 text-center">
      <div className="p-6 text-red-500 font-medium">{error}</div>
      <motion.button
        onClick={onRefresh}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-2 rounded-full bg-[#FFD700] text-black font-semibold shadow-md 
                  hover:bg-yellow-500 transition-colors duration-200 flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Refresh
      </motion.button>
      <div className="mt-4">
        <BackButton href="/projects" label="Back to Projects" />
      </div>
    </div>
  );
}