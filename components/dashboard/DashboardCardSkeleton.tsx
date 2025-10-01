"use client";
import { motion } from "framer-motion";

export default function DashboardCardSkeleton() {
  return (
    <motion.div
      className="p-4 bg-gray-800 rounded-lg border border-gray-600"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 1.2 }}
    >
      <div className="h-6 w-32 bg-gray-700 rounded mb-2" />
      <div className="h-4 w-1/2 bg-gray-600 rounded mb-1" />
      <div className="h-4 w-2/3 bg-gray-600 rounded" />
    </motion.div>
  );
}
