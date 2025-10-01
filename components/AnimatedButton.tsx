"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { RepeatType, Transition } from "framer-motion"; // Import necessary types

type AnimatedButtonProps = {
  label: string;
  href: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void; 
};

export default function AnimatedButton({ label, href, className, onClick }: AnimatedButtonProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => setIsHovered(false);

  // Determine the primary color based on hover state
  const primaryColor = isHovered ? '#FFFFFF' : '#FFD700';

  // Define the continuous rotation animation for the border
  const borderAnimation = {
    rotate: [0, 360],
    transition: {
      repeat: Infinity,
      // FIX: Explicitly cast 'loop' to the expected Framer Motion type
      repeatType: "loop" as RepeatType, 
      duration: 3, 
      ease: "linear", 
    } as Transition, // Cast the entire transition object as Transition for robustness
  };

  // Define a smooth transition for the hover effects (scale, text color, arrow movement)
  const smoothHoverTransition = {
    type: "tween",
    ease: "easeOut",
    duration: 0.3,
  } as Transition; // Cast the transition object as Transition

  return (
    <motion.a
      href={href}
      className={`relative z-50 flex items-center justify-center rounded p-[2px] overflow-hidden ${className || ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }}
      transition={smoothHoverTransition}
      onClick={onClick} 
      
    >
      
      {/* 1. Animated Circling Border Layer */}
      <motion.div
        className="absolute z-0 rounded-lg"
        style={{
          width: '200%', 
          height: '200%', 
          top: '-50%', 
          left: '-50%', 
          willChange: 'transform', 
          background: `conic-gradient(from 0deg, transparent 0%, transparent 70%, ${primaryColor} 100%)`,
          filter: "blur(6px)", 
          opacity: 1, 
        }}
        // Animate the rotation continuously
        animate={borderAnimation}
        // Animate the background color shift smoothly on hover/unhover
        transition={{ ...borderAnimation.transition, background: smoothHoverTransition }}
      />

      {/* 2. Main Button Content Container (The interior of the button) */}
      <div 
        className="relative z-10 w-full h-full flex items-center justify-center gap-2 
                   bg-black rounded-[5px] transition-colors duration-300"
        style={{ padding: "12px 24px" }} 
      >
        
        {/* Glowing effect inside the button (radial, on hover) */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full rounded-lg z-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.15) 30%, transparent 70%)`,
            filter: "blur(40px)", 
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Button content (Label and Arrow) */}
        <div 
          className="relative z-20 flex items-center gap-2 font-semibold transition-colors duration-300"
          style={{ 
            color: primaryColor,
            transition: 'color 0.3s ease-out'
          }}
        >
          <span>{label}</span>
          <motion.div
            animate={{ x: isHovered ? 5 : 0 }}
            transition={smoothHoverTransition}
          >
            <ArrowRight size={20} />
          </motion.div>
        </div>
      </div>
    </motion.a>
  );
}