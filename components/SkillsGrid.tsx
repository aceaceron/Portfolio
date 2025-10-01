"use client";
import { JSX, useState } from "react";
import { motion, Variants } from "framer-motion";
import { 
  FaReact, FaNodeJs, FaHtml5, FaCss3, FaPython, FaPhp, FaJava, FaServer, FaNpm 
} from "react-icons/fa";
import { 
  SiNextdotjs, SiTailwindcss, SiSupabase, SiC, SiSqlite, SiMysql, SiFirebase, SiMongodb, 
  SiChartdotjs, SiLeaflet, SiScikitlearn, SiPandas, SiMqtt, SiRaspberrypi, SiArduino, SiGithub, SiGit,
  SiFramer, SiTypescript, SiNumpy  
} from "react-icons/si";
import { IconType } from "react-icons";

type Skill = {
  name: string;
  icon: IconType | (() => JSX.Element);
  bgColor: string;
};

// Export the skills data for use in other components
export const skillsData: Skill[] = [
  { name: "HTML5", icon: FaHtml5, bgColor: "bg-red-600" },
  { name: "CSS", icon: FaCss3, bgColor: "bg-blue-600" },
  { name: "JavaScript", icon: FaReact, bgColor: "bg-yellow-500" },
  { name: "TypeScript", icon: SiTypescript, bgColor: "bg-blue-500" }, 
  { name: "PHP", icon: FaPhp, bgColor: "bg-indigo-600" },
  { name: "Python", icon: FaPython, bgColor: "bg-green-600" },
  { name: "Java", icon: FaJava, bgColor: "bg-red-700" },
  { name: "C++", icon: SiC, bgColor: "bg-blue-700" },
  { name: "VB.NET", icon: () => <span className="text-white font-bold text-lg select-none">VB</span>, bgColor: "bg-purple-700" },
  { name: "Flask", icon: FaServer, bgColor: "bg-gray-700" },
  { name: "React", icon: FaReact, bgColor: "bg-gradient-to-tr from-black to-gray-800" },
  { name: "Next.js", icon: SiNextdotjs, bgColor: "bg-gradient-to-tr from-black to-gray-800" },
  { name: "Tailwind", icon: SiTailwindcss, bgColor: "bg-gradient-to-tr from-black to-gray-800" },
  { name: "Framer Motion", icon: SiFramer, bgColor: "bg-black" },
  { name: "Node.js", icon: FaNodeJs, bgColor: "bg-green-700" },
  { name: "NPM", icon: FaNpm, bgColor: "bg-red-700" },
  { name: "Supabase", icon: SiSupabase, bgColor: "bg-blue-700" },
  { name: "SQLite3", icon: SiSqlite, bgColor: "bg-blue-400" },
  { name: "MySQL", icon: SiMysql, bgColor: "bg-blue-600" },
  { name: "Firebase", icon: SiFirebase, bgColor: "bg-yellow-400" },
  { name: "MongoDB", icon: SiMongodb, bgColor: "bg-green-700" },
  { name: "Chart.js", icon: SiChartdotjs, bgColor: "bg-blue-500" },
  { name: "Leaflet.js", icon: SiLeaflet, bgColor: "bg-green-500" },
  { name: "flatpickr", icon: FaServer, bgColor: "bg-purple-500" },
  { name: "NumPy", icon: SiNumpy, bgColor: "bg-blue-500" },
  { name: "scikit-learn", icon: SiScikitlearn, bgColor: "bg-blue-600" },
  { name: "pandas", icon: SiPandas, bgColor: "bg-indigo-600" },
  { name: "MQTT", icon: SiMqtt, bgColor: "bg-gray-700" },
  { name: "Raspberry", icon: SiRaspberrypi, bgColor: "bg-red-600" },
  { name: "Arduino", icon: SiArduino, bgColor: "bg-red-400" },
  { name: "Machine Learning", icon: () => <span className="text-white font-bold text-lg select-none">ML</span>, bgColor: "bg-orange-500" },
  { name: "Large Language Model", icon: () => <span className="text-white font-bold text-lg select-none">LLM</span>, bgColor: "bg-purple-700" },
  { name: "Git", icon: SiGit, bgColor: "bg-orange-600" },
  { name: "GitHub", icon: SiGithub, bgColor: "bg-gray-800" },
];

// Utility function to get skill data by name
export const getSkillByName = (name: string): Skill | undefined => {
  return skillsData.find(skill => 
    skill.name.toLowerCase() === name.toLowerCase() ||
    skill.name.toLowerCase().includes(name.toLowerCase()) ||
    name.toLowerCase().includes(skill.name.toLowerCase())
  );
};

// Utility function to get multiple skills by names
export const getSkillsByNames = (names: string[]): Skill[] => {
  return names.map(name => getSkillByName(name)).filter(Boolean) as Skill[];
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
            <motion.span className="mt-2 text-white text-xs font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity">
              {skill.name}
            </motion.span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}