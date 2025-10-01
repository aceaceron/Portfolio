"use client";
import { motion, HTMLMotionProps } from "framer-motion";

interface DashboardCardSkeletonProps extends HTMLMotionProps<"div"> {}

export default function DashboardCardSkeleton({
  className,
  ...props
}: DashboardCardSkeletonProps) {
  return (
    <motion.div
      className={`p-4 bg-gray-800 rounded-lg border border-gray-600 ${className || ""}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 1.2 }}
      {...props}
    >
      <div className="h-6 w-32 bg-gray-700 rounded mb-2" />
      <div className="h-4 w-1/2 bg-gray-600 rounded mb-1" />
      <div className="h-4 w-2/3 bg-gray-600 rounded" />
    </motion.div>
  );
}
