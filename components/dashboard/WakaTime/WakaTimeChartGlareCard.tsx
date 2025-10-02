"use client";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import CardAnimationWrapper, { childVariants } from "../../CardAnimationWrapper";

interface ChartGlareCardProps {
  title: string;
  index: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * A reusable wrapper component that provides the animated card (via CardAnimationWrapper)
 * and the dynamic mouse-driven glare/hover effect.
 */
export default function ChartGlareCard({
  title,
  index,
  className = "w-full",
  children,
}: ChartGlareCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <CardAnimationWrapper
      index={index}
      className={className}
    >
      <motion.div
        variants={childVariants}
        className="relative p-4 bg-gray-800 rounded-lg border border-gray-600 overflow-hidden group min-h-[400px]"
        onMouseMove={handleMouseMove}
      >
        {/* Dynamic Glare Effect */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 215, 0, 0.15), transparent 40%)`,
          }}
        />
        
        <div className="relative z-10">
          <h3 className="font-semibold text-lg mb-2 text-white">{title}</h3>
          {children}
        </div>
      </motion.div>
    </CardAnimationWrapper>
  );
}
