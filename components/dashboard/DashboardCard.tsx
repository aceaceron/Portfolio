import { motion } from "framer-motion";
import { useState } from "react";

interface DashboardCardProps {
  title: string;
  value: any;
  description?: string;
  animate?: boolean;
  className?: string; // ✅ allow external classes
}

export default function DashboardCard({
  title,
  value,
  description,
  animate,
  className,
}: DashboardCardProps) {
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={animate ? { opacity: 0, y: 20 } : {}}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative rounded-lg overflow-hidden bg-gray-800 border border-gray-600 ${className}`} // ✅ apply className
    >
      {/* Card content */}
      <div className="relative z-10 p-4 flex flex-col justify-between h-full">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {description && <p className="text-gray-400 mt-2">{description}</p>}
      </div>

      {/* Glow effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none z-20"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.4) 0%, rgba(255,215,0,0.2) 30%, transparent 70%)`,
          filter: "blur(50px)",
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
}
