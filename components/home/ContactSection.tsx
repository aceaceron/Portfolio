"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import GlowingCardWrapper from "../GlowingCardWrapper";

interface Contact {
  name: string;
  Icon: React.ElementType;
  description: string;
  link: string;
  color: string;
  hoverBg: string;
  buttonLabel: string;
}

interface Props {
  contactData: Contact[];
}

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

export default function ContactSection({ contactData }: Props) {
  const router = useRouter();

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      variants={sectionVariants}
      custom={4}
      viewport={{ once: true, amount: 0.2 }}
      className="mt-6"
    >
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <Mail size={24} className="text-[#FFD700]" /> Contact
      </h2>
      <p className="text-gray-300 mb-4">
        Get in touch with me or connect via my social platforms!
      </p>

      <GlowingCardWrapper
        onClick={() => router.push("/contact")}
        className="cursor-pointer w-full border border-gray-600 rounded-xl p-4"
      >
        {/* Desktop: 5 icons in a single row */}
        <div className="hidden md:flex justify-between gap-4">
          {contactData.map((contact, index) => (
            <div
              key={index}
              className={`
                flex flex-col items-center justify-center 
                p-4 rounded-lg transition 
                ${contact.hoverBg} hover:scale-105
                flex-1
              `}
            >
              <contact.Icon className={`w-10 h-10 ${contact.color}`} />
            </div>
          ))}
        </div>

        {/* Mobile: 3 + 2 icons in two rows */}
        <div className="flex flex-col gap-4 md:hidden">
          {/* First row: 3 icons */}
          <div className="flex justify-between">
            {contactData.slice(0, 3).map((contact, index) => (
              <div
                key={index}
                className={`
                  flex flex-col items-center justify-center 
                  p-4 rounded-lg transition 
                  ${contact.hoverBg} hover:scale-105
                `}
              >
                <contact.Icon className={`w-10 h-10 ${contact.color}`} />
              </div>
            ))}
          </div>

          {/* Second row: 2 icons */}
          <div className="flex justify-around">
            {contactData.slice(3, 5).map((contact, index) => (
              <div
                key={index}
                className={`
                  flex flex-col items-center justify-center 
                  p-4 rounded-lg transition 
                  ${contact.hoverBg} hover:scale-105
                `}
              >
                <contact.Icon className={`w-10 h-10 ${contact.color}`} />
              </div>
            ))}
          </div>
        </div>
      </GlowingCardWrapper>
    </motion.section>
  );
}
