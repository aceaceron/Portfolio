"use client";

import { ReactNode, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  status?: "success" | "error" | null;
  hasErrors?: boolean; 
};

export default function GlowingCardWrapper({ children, className, status, hasErrors = false }: Props) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsHovered(true);
  };

  const handleMouseLeave = () => setIsHovered(false);

  const baseGlowColor = "rgba(255, 215, 0, 0.2)"; // soft gold
  const lightGoldShadow = "0 0 15px 5px rgba(255, 215, 0, 0.15)"; // always visible gold shadow

  const statusBorder =
    status === "success"
      ? `border-green-400 shadow-[0_0_20px_4px_rgba(34,197,94,0.5)] ${lightGoldShadow}`
      : status === "error"
      ? `border-red-400 shadow-[0_0_20px_4px_rgba(239,68,68,0.5)] animate-pulse ${lightGoldShadow}`
      : `border-gray-800/50 shadow-2xl ${lightGoldShadow}`;

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl bg-gray-900/70 p-6 transition-all duration-500 ${statusBorder} ${className ?? ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03, boxShadow: `0 0 40px rgba(255, 215, 0, 0.3), ${lightGoldShadow}` }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="absolute top-0 left-0 w-full h-full rounded-xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2) 0%, ${baseGlowColor} 30%, transparent 70%)`,
          filter: "blur(40px)",
        }}
        animate={{ opacity: isHovered && !hasErrors ? 1 : 0 }} // hide glow if typing / errors cleared
        transition={{ duration: 0.4 }}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
