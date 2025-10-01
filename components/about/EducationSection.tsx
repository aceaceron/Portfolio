"use client";

import { useEffect, useState } from "react";
import { FaGraduationCap } from "react-icons/fa";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase.client";
import { Card, CardContent } from "@/components/ui/card";
import CardAnimationWrapper from "../CardAnimationWrapper"; // Import the wrapper

const popUp = {
  hidden: { opacity: 0, scale: 0.8, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

interface Education {
  id: number;
  title: string;
  degree: string;
  yearStarted?: string;
  yearEnded?: string;
  location?: string;
  fullWidth?: boolean;
  imageUrl?: string;
}

export default function EducationSection() {
  const [educationData, setEducationData] = useState<Education[]>([]);

  useEffect(() => {
    const fetchEducation = async () => {
      const { data, error } = await supabase.from("education").select("*");
      if (error) return console.error(error);
      const edu: Education[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        degree: item.degree,
        yearStarted: item.year_started,
        yearEnded: item.year_ended,
        location: item.location,
        fullWidth: item.full_width,
        imageUrl: item.img,
      }));
      setEducationData(edu);
    };
    fetchEducation();
  }, []);

  return (
    <section className="mt-12">
      {/* Animated heading & description (Keep existing animation) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={popUp}
      >
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
          <FaGraduationCap className="text-[#FFD700]" /> Education
        </h2>
        <p className="text-gray-300 mb-4">
          A summary of the institutions I have attended and the degree I have earned.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {educationData.map((edu) => (
          // 2. Use CardAnimationWrapper instead of motion.div for the item animation
          <CardAnimationWrapper
            key={edu.id}
            className={edu.fullWidth ? "md:col-span-2" : ""}
            // Removed: initial, whileInView, variants, viewport, transition
          >
            <Card className="relative overflow-hidden rounded-lg shadow-lg border border-white w-full">
              {edu.imageUrl && (
                <img
                  src={edu.imageUrl}
                  alt={edu.title}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
              <CardContent className="relative z-10 flex flex-col justify-center min-h-[250px] p-6 text-white">
                <h3 className="font-semibold text-lg">{edu.title}</h3>
                <p>{edu.degree}</p>
                {(edu.yearStarted || edu.yearEnded) && (
                  <p>{edu.yearStarted} - {edu.yearEnded}</p>
                )}
                <p>{edu.location}</p>
              </CardContent>
            </Card>
          </CardAnimationWrapper>
        ))}
      </div>

      <hr className="mt-8 border-[#FFD700]" />
    </section>
  );
}
