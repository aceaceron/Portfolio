import * as React from "react";
import { motion } from "framer-motion";

type Tech = {
  name: string;
  icon?: any;
  bgColor?: string;
};

type ProjectTechStackProps = {
  techStack: Tech[];
  onTechClick: (techName: string) => void;
  itemVariants: any;
};

export default function ProjectTechStack({
  techStack,
  onTechClick,
  itemVariants,
}: ProjectTechStackProps) {
  if (!techStack || techStack.length === 0) return null;

  return (
    <>
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold mt-6">Tech Stack</h2>
      </motion.div>
      <motion.div
        variants={itemVariants}
        className="flex gap-2 flex-wrap mt-2"
      >
        {techStack.map((tech, index) => {
          const Icon = tech.icon;
          return (
            <motion.div
              key={`${tech.name}-${index}`}
              className="flex flex-col items-center cursor-pointer group"
              style={{ width: "44px" }}
              whileHover={{ scale: 1.1 }}
              transition={{ stiffness: 300, damping: 20 }}
            >
              <div
                className={`w-9 h-9 rounded-full border-2 border-[#FFD700] ${
                  tech.bgColor || "bg-gray-600"
                } flex items-center justify-center text-white`}
              >
                {Icon ? (
                  <Icon size={16} />
                ) : (
                  <span className="text-[10px]">?</span>
                )}
              </div>
              <span className="mt-1 text-white text-[10px] font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {tech.name}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
}