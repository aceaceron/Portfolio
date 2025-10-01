"use client";

import { motion, Easing, Variants } from "framer-motion";
import AboutHero from "../../components/about/Hero";
import EducationSection from "../../components/about/EducationSection";
import CareerSection from "../../components/about/CareerSection";
import CoreValuesSection from "../../components/about/CoreValuesSection";
import TestimonialsSection from "../../components/about/TestimonialsSection";
import AnimatedButton from "../../components/AnimatedButton";
// 1. Import CardAnimationWrapper
import CardAnimationWrapper from "../../components/CardAnimationWrapper"; 

// 2. Define itemVariants based on the original fadeUp, making it a child of the staggered container
// This variant will be applied to all top-level sections within the CardAnimationWrapper.
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
        duration: 0.6, 
        ease: [0.25, 0.1, 0.25, 1] // Retains the custom easing
    } 
  },
};

export default function AboutPage() {
  return (
    
    
    // 3. Replace <main> with CardAnimationWrapper to initiate the page-load staggered animation
    // The wrapper handles initial, animate, and staggerChildren logic.
    <CardAnimationWrapper className="px-8 md:ml-64">
      
      {/* Hero + Gallery - Stays outside the motion-wrapped sections */}
      <AboutHero />

      {/* Description Block */}
      {/* 4. Apply itemVariants to the section to participate in the stagger */}
      <motion.section
        className="mb-12 space-y-4 text-gray-300"
        variants={itemVariants}
      >
        <p>
            As an aspiring full-stack developer in Labo, Camarines Norte, Philippines, I build functional systems from the ground up. I leverage HTML, CSS, and JavaScript to create responsive and engaging user interfaces with a keen focus on intuitive UI/UX design.       
        </p>
        <p>
            Now, with ongoing exploration, I have built up sufficient knowledge in modern frameworks and libraries, including React for dynamic front-ends, Next.js for full-stack server-side rendering, and Tailwind CSS for accelerated styling. 
        </p>
        <p>
            My existing skillset also encompasses efficient database management, developing robust backend logic, and seamlessly integrating third-party APIs for streamlined, efficient development.
        </p>
      </motion.section>

      {/* Download Buttons Section */}
      <motion.section
        className="mb-12 flex flex-wrap gap-4"
        variants={itemVariants} // Participates in stagger
      >
        <AnimatedButton label="Download Portfolio" href="/portfolio.pdf" />
        <AnimatedButton label="Download Resume" href="/resume.pdf" />
      </motion.section>

      {/* Separator */}
      <motion.hr variants={itemVariants} className="mt-6 border-[#FFD700]" />

      {/* Sections - Wrap each section in a motion.div to apply itemVariants and stagger their appearance */}
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
