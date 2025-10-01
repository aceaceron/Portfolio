"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import Image from "next/image";
import GlowingCardWrapper from "../GlowingCardWrapper";
import { supabase } from "../../lib/supabase.client";
import CardAnimationWrapper from "../CardAnimationWrapper"; // Import the wrapper

const popUp = {
  hidden: { opacity: 0, scale: 0.8, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

interface Testimonial {
  id: number;
  name: string;
  text: string;
  imageUrl?: string;
}

export default function TestimonialsSection() {
  const [testimonialsData, setTestimonialsData] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase.from("testimonials").select("*");
      if (error) return console.error(error);
      const testimonials: Testimonial[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        text: item.text,
        imageUrl: item.img,
      }));
      setTestimonialsData(testimonials);
    };
    fetchTestimonials();
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
          <Users size={24} className="text-[#FFD700]" /> Testimonials
        </h2>
        <p className="text-gray-300 mb-4">
          Feedback and recommendations from my professors.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonialsData.map((t) => (
          // 2. Use CardAnimationWrapper instead of motion.div for the item animation
          <CardAnimationWrapper
            key={t.id}
            // Removed: initial, whileInView, variants, viewport, transition
          >
            <GlowingCardWrapper className="relative flex flex-col items-start pt-16 pb-4 border-2 border-[#FFD700] rounded-lg">
              <div className="absolute -top-8 left-4 w-16 h-16 rounded-full overflow-hidden border-2 border-[#FFD700]">
                {t.imageUrl && (
                  <Image
                    src={t.imageUrl}
                    alt={t.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                )}
              </div>
              <div className="mt-12 px-6 text-gray-300">
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-sm">{t.text}</p>
              </div>
            </GlowingCardWrapper>
          </CardAnimationWrapper>
        ))}
      </div>
    </section>
  );
}
