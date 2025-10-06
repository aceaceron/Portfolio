"use client";

import { motion } from "framer-motion";
import ImageGallery from "../ImageGallery";
import { FaRegHandPaper } from "react-icons/fa";

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
        
        <div className="flex items-center gap-2 mb-2">
          <FaRegHandPaper className="w-7 h-7 text-yellow-400" />
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600">
            About Me
          </h1>
        </div>
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
