"use client";

import { useEffect, useState } from "react";
import { motion, Transition } from "framer-motion"; // Ensure Transition is imported
import { FaBriefcase } from "react-icons/fa";
import { supabase } from "../../lib/supabase.client";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronLeft } from "lucide-react";
import CardAnimationWrapper from "../CardAnimationWrapper";
import { FaRegGrinWink } from "react-icons/fa"; 

const popUp = {
  hidden: { opacity: 0, scale: 0.8, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

// Animation for the "shy" emoji
const shynessEmojiVariants = {
  initial: { opacity: 0, scale: 0.5, rotateY: 90, rotateZ: -10 },
  animate: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    rotateZ: 0,
    // Fix for 'animate' transition property
    transition: {
      duration: 1,
      type: "spring",
      stiffness: 100,
      damping: 10,
    } as Transition, 
  },
  // Simple "shivering" or "shyness" animation loop
  shy: {
    rotateZ: [-2, 2, -2, 2, 0],
    scale: [1, 1.05, 1, 1.05, 1],
    // Fix for 'shy' transition property
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut", // The string that needed casting
      delay: 1,
    } as Transition, // Explicitly cast as Transition
  },
};

interface Career {
  id: number;
  title: string;
  company: string;
  period: string;
  location?: string;
  responsibilities: string[];
  fullWidth?: boolean;
  imageUrl?: string;
}

export default function CareerSection() {
  const [careerData, setCareerData] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [clickedCard, setClickedCard] = useState<number | null>(null);

  useEffect(() => {
    const fetchCareer = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("career").select("*");
      if (error) return console.error(error);
      const careers: Career[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        company: item.company,
        period: item.period,
        location: item.location,
        responsibilities: item.responsibilities || [],
        fullWidth: item.fullWidth,
        imageUrl: item.img || "",
      }));
      setCareerData(careers);
      setLoading(false);
    };
    fetchCareer();
  }, []);

  const isFlipped = (id: number) => hoveredCard === id || clickedCard === id;

  const showEmptyState = !loading && careerData.length === 0;

  return (
    <section className="mt-8">
      {/* Animated heading & description (Keep existing animation) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={popUp}
      >
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
          <FaBriefcase className="text-[#FFD700]" /> Career
        </h2>
        <p className="text-gray-300 mb-4">
          My professional experience and roles in different organizations.
        </p>
      </motion.div>

      <div className="flex flex-col gap-6">
        {loading ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 text-center py-8"
          >
            Fetching career data...
          </motion.p>
        ) : showEmptyState ? (
          <motion.div
            className="flex flex-col items-center justify-center p-12 bg-gray-800 rounded-lg shadow-xl text-center"
            initial="initial"
            animate="animate"
            variants={popUp}
          >
            <motion.div
              className="mb-4 text-7xl"
              style={{ perspective: 1000 }} 
              variants={shynessEmojiVariants}
              animate={["animate", "shy"]} 
            >
              <FaRegGrinWink className="text-[#FFD700]" /> 
            </motion.div>
            <p className="text-gray-300">
              Whoops! It looks like my professional journey is just beginning. I
              haven't accumulated any work experience yet, but I'm eagerly
              preparing to launch my career soon!
            </p>
          </motion.div>
        ) : (
          careerData.map((job) => (
            <CardAnimationWrapper
              key={job.id}
              className={`relative w-full perspective cursor-pointer ${job.fullWidth ? "md:col-span-2" : ""}`}
              style={{ perspective: 1500 }}
              onHoverStart={() => setHoveredCard(job.id)}
              onHoverEnd={() => setHoveredCard(null)}
              onClick={() =>
                setClickedCard(clickedCard === job.id ? null : job.id)
              }
            >
              <motion.div
                className="relative w-full h-64 md:h-80"
                animate={{
                  rotateY: isFlipped(job.id) ? 180 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front Side */}
                <Card
                  className="absolute inset-0 rounded-lg overflow-hidden shadow-lg"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {job.imageUrl && (
                    <img
                      src={job.imageUrl}
                      alt={job.title}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
                  <CardContent className="relative z-10 flex flex-col justify-center h-full p-6 text-white">
                    <h3 className="font-bold text-xl">{job.title}</h3>
                    <p className="text-sm">{job.company}</p>
                    <p className="text-sm">{job.period}</p>
                    <p className="text-sm">{job.location}</p>

                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-white opacity-70" size={24} />
                  </CardContent>
                </Card>

                {/* Back Side */}
                <Card
                  className="absolute inset-0 rounded-lg overflow-auto shadow-lg text-gray-200"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  {job.imageUrl && (
                    <img
                      src={job.imageUrl}
                      alt={job.title}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40" />
                  <CardContent className="relative z-10 flex flex-col h-full p-6 pl-12 overflow-auto text-left">
                    <h3 className="font-bold text-lg mb-2">Roles & Responsibilities</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm overflow-auto max-h-full">
                      {job.responsibilities.map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>

                    <ChevronLeft className="absolute left-4 top-1/2 -translate-y-1/2 text-white opacity-70" size={24} />
                  </CardContent>
                </Card>
              </motion.div>
            </CardAnimationWrapper>
          ))
        )}
      </div>

      <hr className="mt-12 border-[#FFD700]" />
    </section>
  );
}