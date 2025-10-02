"use client";

import { motion, Variants, easeOut, easeInOut } from "framer-motion";
import { Code } from "lucide-react";
import { skillsData } from "../../components/SkillsGrid";
import CardAnimationWrapper, { childVariants } from "../../components/CardAnimationWrapper";

type Skill = {
  name: string;
  icon: any;
  bgColor: string;
};

// Container to stagger children
const sectionContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// Category label animation
const categoryVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

// Skill icon animation
const iconVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

// Skill name animation (delayed, comes from behind the icon)
const nameVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut, delay: 0.5 } },
};

// Color swap animation for the icon
const bounceHover = {
  scale: 1.05,
  boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
  transition: {
    duration: 0.3,
    ease: easeOut,
  },
};

// Helper: categorize skills
const categorizeSkills = (skills: Skill[]) => ({
  "Programming Languages": skills.filter((s) =>
    ["HTML5","CSS","JavaScript","TypeScript","Python","PHP","Java","C++","VB.NET"].includes(s.name)
  ),
  "Frameworks & Libraries": skills.filter((s) =>
    ["React","Next.js","Tailwind","Framer Motion","Flask","Node.js"].includes(s.name)
  ),
  "Tools & Platforms": skills.filter((s) =>
    ["Git","GitHub","Supabase","SQLite3","MySQL","Firebase","MongoDB","NPM"].includes(s.name)
  ),
  "Data & ML": skills.filter((s) =>
    ["NumPy","pandas","scikit-learn","Machine Learning","Large Language Model"].includes(s.name)
  ),
  "Misc": skills.filter((s) =>
    ![
      "HTML5","CSS","JavaScript","TypeScript","Python","PHP","Java","C++","VB.NET",
      "React","Next.js","Tailwind","Framer Motion","Flask","Node.js",
      "Git","GitHub","Supabase","SQLite3","MySQL","Firebase","MongoDB","NPM",
      "NumPy","pandas","scikit-learn","Machine Learning","Large Language Model"
    ].includes(s.name)
  ),
});

export default function SkillsPage() {
  const categorized = categorizeSkills(skillsData);

  return (
    <div className="md:ml-64 px-8">
      {/* Header */}
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

      {/* Skills Sections */}
      {Object.entries(categorized).map(([category, skills], sectionIndex) => (
        <motion.div
          key={category}
          className="mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionContainer}
        >
          {/* Category label */}
          <motion.h2
            className="text-2xl font-semibold mb-4 flex items-center gap-2 text-white"
            variants={categoryVariants}
          >
            <Code size={24} className="text-[#FFD700]" /> {category}
          </motion.h2>

          {/* Skills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {skills.map((skill) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={skill.name}
                  className="flex flex-col items-center p-4"
                  variants={sectionContainer}
                >
                  {/* Icon with hover bounce */}
                  <motion.div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${skill.bgColor}`}
                    variants={iconVariants}
                    whileHover={bounceHover}
                  >
                    <Icon size={32} />
                  </motion.div>

                  {/* Name (delayed, comes from behind icon) */}
                  <motion.span
                    className="mt-2 text-white text-sm font-semibold text-center whitespace-nowrap"
                    variants={nameVariants}
                  >
                    {skill.name}
                  </motion.span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}