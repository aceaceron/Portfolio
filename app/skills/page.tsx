"use client";

import { motion } from "framer-motion";
import { skillsData } from "../../components/SkillsGrid";
import CardAnimationWrapper, { childVariants } from "../../components/CardAnimationWrapper";
import { categorizeSkills } from "../../components/skills/CategorizeSkills";
import SkillSection from "../../components/skills/SkillSection";

export default function SkillsPage() {
  const categorized = categorizeSkills(skillsData);

  return (
    <div className="md:ml-64 px-8">
      <CardAnimationWrapper index={0} className="mb-2 text-left">
        <motion.h1 variants={childVariants} className="text-3xl md:text-3xl font-bold text-white">
          Skills
        </motion.h1>
      </CardAnimationWrapper>

      <CardAnimationWrapper index={1} className="mb-4 text-left">
        <motion.p variants={childVariants} className="text-gray-300 max-w-2xl">
          Technologies and tools I specialize in.
        </motion.p>
      </CardAnimationWrapper>

      <CardAnimationWrapper index={2}>
        <hr className="border-[#FFD700] mb-8" />
      </CardAnimationWrapper>

      {Object.entries(categorized).map(([category, skills]) => (
        <SkillSection key={category} category={category} skills={skills} />
      ))}
    </div>
  );
}
