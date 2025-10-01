"use client";
import { motion } from "framer-motion";

interface CertificationsToggleProps {
  filter: "certificate" | "badge";
  setFilter: (filter: "certificate" | "badge") => void;
  loading: boolean;
}

export default function CertificationsToggle({ filter, setFilter, loading }: CertificationsToggleProps) {
  if (loading) {
    return (
      <motion.div
        className="flex gap-4 mb-6"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
      >
        <div className="h-10 w-32 bg-gray-700 rounded-full" />
        <div className="h-10 w-32 bg-gray-700 rounded-full" />
      </motion.div>
    );
  }

  return (
    <div className="relative flex justify-left mb-6">
      <div className="relative flex bg-gray-800 rounded-full p-1 w-[280px]">
        <motion.div
          layout
          className="absolute top-0 left-0 h-full w-1/2 bg-[#FFD700] rounded-full shadow-md"
          initial={false}
          animate={{ x: filter === "badge" ? "100%" : "0%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <button
          className={`relative z-10 w-1/2 text-center py-2 rounded-full font-semibold transition-transform duration-200 ${
            filter === "certificate" ? "text-black" : "text-gray-200 hover:text-white"
          }`}
          onClick={() => setFilter("certificate")}
        >
          Certificates
        </button>
        <button
          className={`relative z-10 w-1/2 text-center py-2 rounded-full font-semibold transition-transform duration-200 ${
            filter === "badge" ? "text-black" : "text-gray-200 hover:text-white"
          }`}
          onClick={() => setFilter("badge")}
        >
          Badges
        </button>
      </div>
    </div>
  );
}
