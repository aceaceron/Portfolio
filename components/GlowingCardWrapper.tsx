"use client";

import { useState, ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function GlowingCardWrapper({ children, className, onClick }: Props) {
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

  return (
    <motion.div
      className={`relative overflow-hidden cursor-pointer ${className ?? ""}`} // added cursor-pointer
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick} // ✅ forward click handler
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Glowing effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.4) 0%, rgba(255, 215, 0, 0.2) 30%, transparent 70%)`,
          filter: "blur(50px)",
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Wrapped content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
