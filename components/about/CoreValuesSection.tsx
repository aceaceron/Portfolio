"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import GlowingCardWrapper from "../GlowingCardWrapper";
import { supabase } from "../../lib/supabase.client";
import CardAnimationWrapper from "../CardAnimationWrapper"; // Import the wrapper

const popUp = {
  hidden: { opacity: 0, scale: 0.8, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

interface CoreValue {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export default function CoreValuesSection() {
  const [coreValuesData, setCoreValuesData] = useState<CoreValue[]>([]);

  useEffect(() => {
    const fetchCoreValues = async () => {
      const { data, error } = await supabase.from("core_values").select("*");
      if (error) return console.error(error);
      setCoreValuesData(data || []);
    };
    fetchCoreValues();
  }, []);

  return (
    <section className="mt-12 mb-12">
      {/* Animated heading & description (Keep existing animation) */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={popUp}
      >
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
          <Award size={24} className="text-[#FFD700]" /> Core Values
        </h2>
        <p className="text-gray-300 mb-4">
          The principles and values that guide my approach to work and collaboration.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coreValuesData.map((val) => {
          const IconComponent = (require("lucide-react")[val.icon] || Award) as React.FC<any>;
          return (
            // 2. Use CardAnimationWrapper instead of motion.div for the item animation
            <CardAnimationWrapper
              key={val.id}
              // Removed: initial, whileInView, variants, viewport, transition
            >
              <GlowingCardWrapper className="relative p-4 border-2 border-[#FFD700] rounded-lg">
                <div className="flex flex-col items-start gap-2 relative z-10">
                  <IconComponent className="text-[#FFD700]" />
                  <h3 className="font-semibold text-lg">{val.title}</h3>
                  <p className="text-gray-300 text-sm">{val.description}</p>
                </div>
              </GlowingCardWrapper>
            </CardAnimationWrapper>
          );
        })}
      </div>

      <hr className="mt-12 border-[#FFD700]" />
    </section>
  );
}
