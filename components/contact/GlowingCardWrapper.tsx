"use client";

import { ReactNode, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function GlowingCardWrapper({ children, className }: Props) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => setIsHovered(false);

  const glowColor = "rgba(255, 215, 0, 0.4)";

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl border border-gray-800/50 bg-gray-900/70 p-6 shadow-2xl transition-all duration-300 hover:border-yellow-500/50 ${
        className ?? ""
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(255, 215, 0, 0.3)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="absolute top-0 left-0 w-full h-full rounded-xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.5) 0%, ${glowColor} 30%, transparent 70%)`,
          filter: "blur(50px)",
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
