"use client";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  loading?: boolean;
}

export default function DashboardHeader({ loading }: DashboardHeaderProps) {
  return (
    <>
      {loading ? (
        <>
          <motion.div
            className="h-10 w-48 bg-gray-700 rounded mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
          <motion.div
            className="h-4 w-3/4 bg-gray-600 rounded mb-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: 0.1 }}
          />
        </>
      ) : (
        <>
          <motion.h1
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Dashboard
          </motion.h1>
          <motion.p
            className="text-gray-300 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Overview of my GitHub, WakaTime, and website analytics.
          </motion.p>
        </>
      )}
      <hr className="border-[#FFD700] mb-6" />
    </>
  );
}
