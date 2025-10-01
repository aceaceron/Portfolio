"use client";

import { motion, Variants } from "framer-motion";
import AboutHero from "../../components/about/Hero";
import EducationSection from "../../components/about/EducationSection";
import CareerSection from "../../components/about/CareerSection";
import CoreValuesSection from "../../components/about/CoreValuesSection";
import TestimonialsSection from "../../components/about/TestimonialsSection";
import AnimatedButton from "../../components/AnimatedButton";
import CardAnimationWrapper from "../../components/CardAnimationWrapper";


// Import the Umami tracker
import { trackUmamiEvent } from "../../lib/umami";

// Variants for fade-up animation
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// --------------------
// Download button handler
// --------------------
const handleDownloadClick = (
  e: React.MouseEvent,
  type: "Portfolio" | "Resume",
  href: string
) => {
  e.preventDefault();
  trackUmamiEvent(`Download_${type}`); // Event name now includes type
  setTimeout(() => {
    window.location.href = href;
  }, 100);
};

export default function AboutPage() {
  return (
    <CardAnimationWrapper className="px-8 md:ml-64">
      <AboutHero />

      {/* Description Block */}
      <motion.section
        className="mb-12 space-y-4 text-gray-300"
        variants={itemVariants}
      >
        <p>
          As an aspiring full-stack developer in Labo, Camarines Norte,
          Philippines, I build functional systems from the ground up. I leverage
          HTML, CSS, and JavaScript to create responsive and engaging user
          interfaces with a keen focus on intuitive UI/UX design.
        </p>
        <p>
          Now, with ongoing exploration, I have built up sufficient knowledge in
          modern frameworks and libraries, including React for dynamic
          front-ends, Next.js for full-stack server-side rendering, and Tailwind
          CSS for accelerated styling.
        </p>
        <p>
          My existing skillset also encompasses efficient database management,
          developing robust backend logic, and seamlessly integrating
          third-party APIs for streamlined, efficient development.
        </p>
      </motion.section>

      {/* Download Buttons Section */}
      <motion.section
        className="mb-12 flex flex-wrap gap-4"
        variants={itemVariants}
      >
        <AnimatedButton
          label="Download Portfolio"
          href="/portfolio.pdf"
          onClick={(e) => handleDownloadClick(e, "Portfolio", "/portfolio.pdf")}
        />
        <AnimatedButton
          label="Download Resume"
          href="/resume.pdf"
          onClick={(e) => handleDownloadClick(e, "Resume", "/resume.pdf")}
        />
      </motion.section>

      <motion.hr variants={itemVariants} className="mt-6 border-[#FFD700]" />

      {/* Other Sections */}
      <motion.div variants={itemVariants}>
        <EducationSection />
      </motion.div>
      <motion.div variants={itemVariants}>
        <CareerSection />
      </motion.div>
      <motion.div variants={itemVariants}>
        <CoreValuesSection />
      </motion.div>
      <motion.div variants={itemVariants}>
        <TestimonialsSection />
      </motion.div>
    </CardAnimationWrapper>
  );
}
