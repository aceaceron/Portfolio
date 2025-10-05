"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Code } from "lucide-react";
import { useSession } from "next-auth/react";

import Hero from "../components/home/Hero";
import ProjectsSection from "../components/home/ProjectsSection";
import CertificationsSection from "../components/home/CertificationsSection";
import SkillsShowcase from "../components/home/SkillsShowcase";
import ChatHubSection from "../components/home/ChatHubSection";
import ContactSection from "../components/home/ContactSection";
import CardAnimationWrapper from "@/components/CardAnimationWrapper";

import useMessages from "../hooks/useMessages";
import { contactData } from "../data/contact";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut" as const,
    },
  }),
};

// Define a type that aligns with what next-auth provides and your custom fields
interface CustomSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isAuthor?: boolean; // The key field for author identification
  };
}

export default function Home() {
  const { data: session } = useSession();
  // Cast the session data to your custom type for type safety
  const customSession = session as CustomSession | null; 

  const { messages, isLoading } = useMessages();
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  return (
    <CardAnimationWrapper className="px-8 md:ml-64">
      {/* Hero */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        custom={0}
        viewport={{ once: true, amount: 0.2 }}
      >
        <Hero />
      </motion.div>

      {/* Projects */}
      <ProjectsSection/>

      {/* Skills */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        custom={2}
        viewport={{ once: true, amount: 0.2 }}
        className="mt-6"
      >
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Code size={24} className="text-[#FFD700]" /> Skills
        </h2>
        <p className="text-gray-300 mb-4">
          A mix of technologies, tools, and skills I’ve developed along the way.
        </p>
        <SkillsShowcase />
        <hr className="mt-6 border-[#FFD700]" />
      </motion.section>

      {/* Certifications */}
      <CertificationsSection />

      {/* Chat */}
      <ChatHubSection
        messages={messages}
        customSession={customSession}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
        containerRef={messagesContainerRef}
      />

      {/* Contact */}
      <ContactSection contactData={contactData} />
    </CardAnimationWrapper>
  );
}