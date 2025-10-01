"use client";

import { motion } from "framer-motion";
import ImageGallery from "../ImageGallery";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function AboutHero() {
  return (
    <div className="mb-12">
      {/* Header */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.2 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4">About Me</h1>
        <p className="text-gray-300">
          Hello again! I am Christian Luis Aceron currently residing in Labo, Camarines Norte, Philippines.
        </p>
      </motion.section>

      {/* Gallery */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        viewport={{ once: true, amount: 0.2 }}
      >
        <ImageGallery />
      </motion.div>
    </div>
  );
}
