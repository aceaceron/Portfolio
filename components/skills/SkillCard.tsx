"use client";

import { motion } from "framer-motion";
import {
  iconVariants,
  nameVariants,
  bounceHover,
  dotsContainer,
  dotVariants,
} from "./Animation";

export type Skill = {
  name: string;
  icon: any;
  bgColor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
};

type Props = {
  skill: Skill;
};

export default function SkillCard({ skill }: Props) {
  const Icon = skill.icon;

  return (
    <motion.div
      className="flex flex-col items-center p-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }} // triggers when 40% in view
    >
      <motion.div
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${skill.bgColor}`}
        variants={iconVariants}
        whileHover={bounceHover}
      >
        <Icon size={32} />
      </motion.div>

      <motion.span
        className="mt-2 text-white text-sm font-semibold text-center whitespace-nowrap"
        variants={nameVariants}
      >
        {skill.name}
      </motion.span>

      {/* Animated proficiency dots */}
      <motion.div
        className="flex gap-1 mt-1"
        variants={dotsContainer}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            variants={dotVariants}
            className={`w-2 h-2 rounded-full ${
              (skill.level === "Beginner" && i === 0) ||
              (skill.level === "Intermediate" && i <= 1) ||
              skill.level === "Advanced"
                ? "bg-yellow-400"
                : "bg-gray-600"
            }`}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
