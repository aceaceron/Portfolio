"use client";

import { motion } from "framer-motion";
import { skillsData } from "../../components/SkillsGrid";
import GlowingCardWrapper from "../../components/GlowingCardWrapper";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SkillsShowcase() {
  const router = useRouter();

  const firstRowSkills = skillsData.slice(0, Math.ceil(skillsData.length / 2));
  const secondRowSkills = skillsData.slice(Math.ceil(skillsData.length / 2));

  // Measure row width for seamless animation
  const rowRef1 = useRef<HTMLDivElement>(null);
  const rowRef2 = useRef<HTMLDivElement>(null);
  const [rowWidth1, setRowWidth1] = useState(0);
  const [rowWidth2, setRowWidth2] = useState(0);

  useEffect(() => {
    if (rowRef1.current) setRowWidth1(rowRef1.current.scrollWidth / 2);
    if (rowRef2.current) setRowWidth2(rowRef2.current.scrollWidth / 2);
  }, []);

  const renderRow = (
    skills: typeof skillsData,
    rowRef: any,
    rowWidth: number,
    direction: "left" | "right"
  ) => (
    <div className="overflow-hidden">
      <motion.div
        ref={rowRef}
        className="flex gap-6 sm:gap-12"
        animate={{ x: direction === "left" ? [-rowWidth, 0] : [0, -rowWidth] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        }}
      >
        {[...skills, ...skills].map((skill, index) => {
          const Icon = skill.icon;
          return (
            <div
              key={`${skill.name}-${index}`}
              className="flex flex-col items-center justify-center min-w-[80px] sm:min-w-[100px]"
            >
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white ${skill.bgColor}`}
              >
                <Icon size={32} className="sm:w-8 sm:h-8" />
              </div>
              {/* Skill name removed */}
            </div>
          );
        })}
      </motion.div>
    </div>
  );

  return (
    <div>
      <div className="max-w-[75vw] sm:max-w-[50vw] mx-auto">
        <GlowingCardWrapper
          className="pt-6 pb-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl cursor-pointer hover:bg-gray-800/70 transition"
          onClick={() => router.push("/skills")}
        >
          <div className="space-y-8">
            {/* First row - right to left */}
            {renderRow(firstRowSkills, rowRef1, rowWidth1, "left")}

            {/* Second row - left to right */}
            {renderRow(secondRowSkills, rowRef2, rowWidth2, "right")}
          </div>
        </GlowingCardWrapper>
      </div>
    </div>
  );
}
