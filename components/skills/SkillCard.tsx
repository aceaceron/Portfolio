"use client";

import { motion } from "framer-motion";
import { iconVariants, nameVariants, bounceHover } from "./Animation";

export type Skill = {
  name: string;
  icon: any;
  bgColor: string;
};

type Props = {
  skill: Skill;
};

export default function SkillCard({ skill }: Props) {
  const Icon = skill.icon;
  return (
    <motion.div className="flex flex-col items-center p-4" variants={{}}>
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
    </motion.div>
  );
}
