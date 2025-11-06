"use client";
import { JSX, useState } from "react";
import { motion, Variants } from "framer-motion";
import { IconType } from "react-icons";
import {
  Camera,
  PenTool,
  Video,
  FileText,
  Mic,
  Presentation,
} from "lucide-react";
import { FiFigma } from "react-icons/fi";
import { iconMap } from "../utils/icons";

export type Skill = {
  name: string;
  icon: IconType | (() => JSX.Element);
  bgColor: string;
  level: "Beginner" | "Intermediate" | "Advanced";
};

const levelMapping: Record<string, Skill["level"]> = {
  // Core Web
  HTML5: "Advanced",
  CSS: "Advanced",
  JavaScript: "Advanced",
  TypeScript: "Intermediate",
  Python: "Beginner",
  PHP: "Beginner",
  Java: "Intermediate",
  "C++": "Beginner",
  "VB.NET": "Beginner",

  // Frameworks & Tools
  React: "Intermediate",
  "Next.js": "Intermediate",
  Tailwind: "Intermediate",
  "Framer Motion": "Intermediate",
  "Node.js": "Intermediate",
  NPM: "Intermediate",

  Supabase: "Intermediate",
  SQLite3: "Intermediate",
  MySQL: "Advanced",
  Firebase: "Intermediate",
  MongoDB: "Beginner",

  // Data / ML
  NumPy: "Intermediate",
  pandas: "Intermediate",
  "scikit-learn": "Intermediate",
  "Machine Learning": "Intermediate",
  "Large Language Model": "Intermediate",

  // Others
  Git: "Advanced",
  GitHub: "Advanced",
  Figma: "Intermediate",

  // Creative
  "Video Editing": "Intermediate",
  "Graphic Design": "Intermediate",
  Canva: "Intermediate",
  Photography: "Intermediate",
  "Creative Writing": "Advanced",
  "Public Speaking": "Advanced",
  "Presentation Skills": "Advanced",
};

// Export the skills data for use in other components
export const skillsData: Skill[] = [
  // Core Web & Programming
  { name: "HTML5", icon: iconMap.FaHtml5, bgColor: "bg-red-600" },
  { name: "CSS", icon: iconMap.FaCss3, bgColor: "bg-blue-600" },
  { name: "JavaScript", icon: iconMap.FaJs, bgColor: "bg-yellow-500" },
  { name: "TypeScript", icon: iconMap.SiTypescript, bgColor: "bg-blue-500" },
  { name: "PHP", icon: iconMap.FaPhp, bgColor: "bg-indigo-600" },
  { name: "Python", icon: iconMap.FaPython, bgColor: "bg-green-600" },
  { name: "Java", icon: iconMap.FaJava, bgColor: "bg-red-700" },
  { name: "C++", icon: iconMap.SiCplusplus, bgColor: "bg-blue-700" },
  {
    name: "VB.NET",
    icon: () => (
      <span className="text-white font-bold text-lg select-none">VB</span>
    ),
    bgColor: "bg-purple-700",
  },
  { name: "Flask", icon: iconMap.SiFlask, bgColor: "bg-gray-700" },
  {
    name: "React",
    icon: iconMap.FaReact,
    bgColor: "bg-gradient-to-tr from-black to-gray-800",
  },
  {
    name: "Next.js",
    icon: iconMap.SiNextdotjs,
    bgColor: "bg-gradient-to-tr from-black to-gray-800",
  },
  {
    name: "Tailwind",
    icon: iconMap.SiTailwindcss,
    bgColor: "bg-gradient-to-tr from-black to-gray-800",
  },
  { name: "Framer Motion", icon: iconMap.SiFramer, bgColor: "bg-black" },
  { name: "Node.js", icon: iconMap.FaNodeJs, bgColor: "bg-green-700" },
  { name: "NPM", icon: iconMap.FaServer, bgColor: "bg-red-700" },
  { name: "Supabase", icon: iconMap.SiSupabase, bgColor: "bg-blue-700" },
  { name: "SQLite3", icon: iconMap.SiSqlite, bgColor: "bg-blue-400" },
  { name: "MySQL", icon: iconMap.SiMysql, bgColor: "bg-blue-600" },
  { name: "Firebase", icon: iconMap.SiMysql, bgColor: "bg-yellow-400" },
  { name: "MongoDB", icon: iconMap.SiMongodb, bgColor: "bg-green-700" },
  { name: "Chart.js", icon: iconMap.SiChartdotjs, bgColor: "bg-blue-500" },
  { name: "Leaflet.js", icon: iconMap.SiLeaflet, bgColor: "bg-green-500" },
  { name: "flatpickr", icon: iconMap.FaServer, bgColor: "bg-purple-500" },
  { name: "NumPy", icon: iconMap.SiNumpy, bgColor: "bg-blue-500" },
  { name: "scikit-learn", icon: iconMap.SiScikitlearn, bgColor: "bg-blue-600" },
  { name: "pandas", icon: iconMap.SiPandas, bgColor: "bg-indigo-600" },
  { name: "MQTT", icon: iconMap.SiMqtt, bgColor: "bg-gray-700" },
  { name: "Raspberry", icon: iconMap.SiRaspberrypi, bgColor: "bg-red-600" },
  { name: "Arduino", icon: iconMap.SiArduino, bgColor: "bg-red-400" },
  {
    name: "Machine Learning",
    icon: () => (
      <span className="text-white font-bold text-lg select-none">ML</span>
    ),
    bgColor: "bg-orange-500",
  },
  {
    name: "Large Language Model",
    icon: () => (
      <span className="text-white font-bold text-lg select-none">LLM</span>
    ),
    bgColor: "bg-purple-700",
  },
  { name: "Git", icon: iconMap.SiGit, bgColor: "bg-orange-600" },
  { name: "GitHub", icon: iconMap.SiGithub, bgColor: "bg-gray-800" },
  { name: "Figma", icon: () => <FiFigma size={32} />, bgColor: "bg-[#F24E1E]" },

  // Non-IT / creative skills
  { name: "Video Editing", icon: Video, bgColor: "bg-purple-600" },
  { name: "Graphic Design", icon: PenTool, bgColor: "bg-pink-600" },
  { name: "Canva", icon: iconMap.SiCanva, bgColor: "bg-blue-500" },
  { name: "Photography", icon: Camera, bgColor: "bg-blue-600" },
  { name: "Creative Writing", icon: FileText, bgColor: "bg-green-600" },
  { name: "Public Speaking", icon: Mic, bgColor: "bg-orange-600" },
  { name: "Presentation Skills", icon: Presentation, bgColor: "bg-yellow-600" },
].map((skill) => ({
  ...skill,
  level: levelMapping[skill.name] ?? "Beginner", // fallback if missing
}));

// Utility function to get skill data by name
export const getSkillByName = (name: string): Skill | undefined => {
  return skillsData.find(
    (skill) =>
      skill.name.toLowerCase() === name.toLowerCase() ||
      skill.name.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(skill.name.toLowerCase())
  );
};

// Utility function to get multiple skills by names
export const getSkillsByNames = (names: string[]): Skill[] => {
  return names.map((name) => getSkillByName(name)).filter(Boolean) as Skill[];
};

export default function SkillsGrid() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  // Parent container animation
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08, // delay between each child
      },
    },
  };

  // Each skill item animation
  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 10 },
    },
  };

  return (
    <motion.div
      className="flex flex-wrap gap-[10px] justify-start"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // triggers when 20% visible
    >
      {skillsData.map((skill) => {
        const Icon = skill.icon;
        const isActive = activeSkill === skill.name;
        return (
          <motion.div
            key={skill.name}
            variants={itemVariants}
            className="flex flex-col items-center cursor-pointer group"
            style={{ width: "64px" }}
            onClick={() => setActiveSkill(skill.name)}
          >
            <motion.div
              className={`w-16 h-16 rounded-full border-2 border-[#FFD700] ${skill.bgColor} flex items-center justify-center text-white`}
              animate={{ scale: isActive ? 1.15 : 1 }}
              whileHover={{ scale: 1.15 }}
            >
              <Icon size={32} />
            </motion.div>
            <motion.span className="mt-2 text-white text-xs font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {skill.name}
            </motion.span>

            <div className="flex gap-1 mt-1 mx-auto opacity-80">
              {[0, 1, 2].map((index) => (
                <span
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    (skill.level === "Beginner" && index === 0) ||
                    (skill.level === "Intermediate" && index <= 1) ||
                    skill.level === "Advanced"
                      ? "bg-yellow-400"
                      : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
