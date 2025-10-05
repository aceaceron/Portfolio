"use client";

import { motion } from "framer-motion";
import { Code } from "lucide-react";
import SkillCard, { Skill } from "./SkillCard";
import { sectionContainer, categoryVariants } from "./Animation";

type Props = {
  category: string;
  skills: Skill[];
};

export default function SkillSection({ category, skills }: Props) {
  return (
    <motion.div
      className="mb-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionContainer}
    >
      <motion.h2
        className="text-xl font-semibold mb-4 flex items-center gap-2 text-white"
        variants={categoryVariants}
      >
        <Code size={24} className="text-[#FFD700]" /> {category}
        
      </motion.h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {skills.map((skill) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
      </div>
    </motion.div>
  );
}
