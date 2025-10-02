"use client";

import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import SendEmailViaContactPage from "../../components/sendEmailViaContactPage";
import {
  Mail,
  Facebook,
  Linkedin,
  Github,
  Code,
  LucideIcon,
  ArrowRight,
  UserRound,
  MessageCircle,
} from "lucide-react";

// --- GlowingCardWrapper Component ---

type CardWrapperProps = {
  children: ReactNode;
  className?: string;
};

const GlowingCardWrapper = ({ children, className }: CardWrapperProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => setIsHovered(false);

  const glowColor = "rgba(255, 215, 0, 0.4)";

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl border border-gray-800/50 bg-gray-900/70 p-6 shadow-2xl transition-all duration-300 hover:border-yellow-500/50 ${
        className ?? ""
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(255, 215, 0, 0.3)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="absolute top-0 left-0 w-full h-full rounded-xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.5) 0%, ${glowColor} 30%, transparent 70%)`,
          filter: "blur(50px)",
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// --- Contact Card Data ---

interface ContactItem {
  name: string;
  Icon: LucideIcon;
  description: string;
  link: string;
  color: string;
  hoverBg: string;
  buttonLabel: string; // 👈 new field
}

const contactData: ContactItem[] = [
  {
    name: "Gmail Address",
    Icon: Mail,
    description:
      "Send me a direct email for professional or personal inquiries.",
    link: "mailto:your.name@gmail.com",
    color: "text-red-400",
    hoverBg: "hover:bg-red-600/20",
    buttonLabel: "Send me an email", // 👈
  },
  {
    name: "LinkedIn Profile",
    Icon: Linkedin,
    description:
      "Connect with me professionally and view my full career history and experience.",
    link: "https://www.linkedin.com/in/yourprofile",
    color: "text-blue-500",
    hoverBg: "hover:bg-blue-600/20",
    buttonLabel: "Connect with me", // 👈
  },
  {
    name: "GitHub Repositories",
    Icon: Github,
    description:
      "Explore my open-source projects, contributions, and code repositories.",
    link: "https://github.com/yourusername",
    color: "text-gray-300",
    hoverBg: "hover:bg-gray-700/20",
    buttonLabel: "View Repositories", // 👈
  },
  {
    name: "Facebook Page",
    Icon: Facebook,
    description:
      "Follow my personal updates and social activity on this platform.",
    link: "https://www.facebook.com/yourprofile",
    color: "text-blue-400",
    hoverBg: "hover:bg-blue-500/20",
    buttonLabel: "Visit my Facebook", // 👈
  },
  {
    name: "Google Developers Account",
    Icon: Code,
    description:
      "Check out my profile, articles, or contributions on Google Developer platforms.",
    link: "https://developers.google.com/profile/yourid",
    color: "text-yellow-400",
    hoverBg: "hover:bg-yellow-600/20",
    buttonLabel: "View My Dev Profile", // 👈
  },
];

// --- Split contact data ---
const mainContacts: ContactItem[] = [
  contactData[0], // Gmail
  contactData[1], // LinkedIn
  contactData[2], // GitHub
];

const specialContacts: ContactItem[] = [
  contactData[3], // Facebook
  contactData[4], // Google Developers
];

export default function ContactPage() {
  return (
    <div className="min-h-screen p-4 pl-12 pr-12 pt-6 md:ml-64 text-white font-inter">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 text-left">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-7 h-7 text-yellow-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
              Connect With Me
            </h1>
          </div>
          <p className="text-gray-400 text-lg sm:text-xl mx-auto md:mx-0">
            Find me across the web! Use the button below each card to visit my profile.
          </p>
        </header>

        {/* Main Contact Cards (3-column grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {mainContacts.map(({ name, Icon, description, link, color, hoverBg, buttonLabel }) => (
            <GlowingCardWrapper
              key={name}
              className="group h-full flex flex-col justify-between"
            >
              <div>
                <div
                  className={`p-4 rounded-full inline-flex ring-4 ring-inset ${color} ring-opacity-20 transition-colors duration-300 group-hover:ring-opacity-40`}
                >
                  <Icon className={`w-8 h-8 ${color}`} />
                </div>
                <h2 className="text-2xl font-bold mt-6 mb-2 text-white">{name}</h2>
                <p className="text-gray-400 text-base mb-6">{description}</p>
              </div>
              <button
                className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${color} bg-gray-800/50 ${hoverBg} border border-transparent group-hover:border-yellow-500/50`}
                onClick={() => window.open(link, "_blank")}
              >
                <span className="text-white">{buttonLabel}</span>
                <ArrowRight className="w-5 h-5 ml-1 text-yellow-400 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </GlowingCardWrapper>
          ))}
        </div>

        {/* Special Contacts (2-column grid only for FB + Google Dev) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {specialContacts.map(({ name, Icon, description, link, color, hoverBg, buttonLabel }) => (
            <GlowingCardWrapper
              key={name}
              className="group h-full flex flex-col justify-between"
            >
              <div>
                <div
                  className={`p-4 rounded-full inline-flex ring-4 ring-inset ${color} ring-opacity-20 transition-colors duration-300 group-hover:ring-opacity-40`}
                >
                  <Icon className={`w-8 h-8 ${color}`} />
                </div>
                <h2 className="text-2xl font-bold mt-6 mb-2 text-white">{name}</h2>
                <p className="text-gray-400 text-base mb-6">{description}</p>
              </div>
              <button
                className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${color} bg-gray-800/50 ${hoverBg} border border-transparent group-hover:border-yellow-500/50`}
                onClick={() => window.open(link, "_blank")}
              >
                <span className="text-white">{buttonLabel}</span>
                <ArrowRight className="w-5 h-5 ml-1 text-yellow-400 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </GlowingCardWrapper>
          ))}
        </div>

        <hr className="border-[#FFD700] mb-8 mx-auto md:mx-0" />

        {/* --- Send Me a Message Section --- */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-7 h-7 text-yellow-400" />
            <h2 className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
              Send Me a Message
            </h2>
          </div>
          <p className="text-gray-400 text-lg sm:text-xl mb-6">
            Got a question, collaboration idea, or just want to say hi? Fill out the form below and I’ll get back to you.
          </p>
          <GlowingCardWrapper className="p-8">
            <SendEmailViaContactPage />
          </GlowingCardWrapper>
        </section>
      </div>
    </div>
  );
}
