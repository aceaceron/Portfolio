"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import Hero from "../components/home/Hero";
import ProjectCard from "../components/home/ProjectCard";
import CertificationCard from "../components/home/CertificationCard";
import SkillsShowcase from "../components/home/SkillsShowcase";
import { Folder, Code, Award } from "lucide-react";
import { motion } from "framer-motion";
import {
  FaHtml5,
  FaCss3,
  FaJs,
  FaReact,
  FaPhp,
  FaNodeJs,
  FaPython,
} from "react-icons/fa";
import { supabase as supabaseClient } from "../lib/supabase.client";
import { useSession } from "next-auth/react";
import ChatMessages from "../components/chat/ChatMessages";

import GlowingCardWrapper from "../components/GlowingCardWrapper";
import { useRouter } from "next/navigation";
import { HiOutlineChat } from "react-icons/hi";
import { Mail, Facebook, Linkedin, Github, LucideIcon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import {
  SiNextdotjs,
  SiTailwindcss,
  SiSupabase,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiTypescript,
  SiExpress,
  SiDjango,
  SiFlask,
} from "react-icons/si";

// Enhanced icon mapping with more technologies
const iconMap: Record<string, any> = {
  FaHtml5,
  FaCss3,
  FaJs,
  FaReact,
  FaPhp,
  FaNodeJs,
  FaPython,
  SiNextdotjs,
  SiTailwindcss,
  SiSupabase,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiTypescript,
  SiExpress,
  SiDjango,
  SiFlask,
};

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

interface Message {
  id: string;
  user_id: string;
  user_name: string;
  text: string;
  created_at: string;
  users?: {
    image: string | null;
    is_author: boolean | null;
  } | null;
}

interface CustomSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isAuthor?: boolean;
  };
}

// Helper function to safely parse JSON strings
function safeJsonParse(jsonString: string | any, fallback: any = null) {
  if (typeof jsonString === "string") {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.warn("Failed to parse JSON:", jsonString, e);
      return fallback;
    }
  }
  return jsonString || fallback;
}

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [certsLoading, setCertsLoading] = useState(true);
  const [certsError, setCertsError] = useState<string | null>(null);

  const { data: session } = useSession();
  const customSession = session as CustomSession | null;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const supabase = useMemo(() => supabaseClient, []);

  const router = useRouter();

  // 🔒 Decrypt messages
  const decryptMessages = async (
    encryptedMessages: Message[]
  ): Promise<Message[]> => {
    try {
      const response = await fetch("/api/auth/decrypt-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: encryptedMessages }),
      });
      if (!response.ok) return encryptedMessages;
      const { decryptedMessages } = await response.json();
      return decryptedMessages;
    } catch (error) {
      console.error("Error decrypting messages:", error);
      return encryptedMessages;
    }
  };

  // 📨 Fetch messages
  const fetchMessages = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        users:user_id (
          image,
          is_author
        )
      `
      )
      .order("created_at", { ascending: true });

    if (!error && data) {
      const decrypted = await decryptMessages(data);
      setMessages(decrypted);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMessages();

    // Realtime subscription
    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const { data: userData } = await supabase
            .from("users")
            .select("image, is_author")
            .eq("id", payload.new.user_id)
            .single();

          const newMessage: Message = {
            ...(payload.new as Message),
            users: userData
              ? { image: userData.image, is_author: userData.is_author }
              : null,
          };

          const [decrypted] = await decryptMessages([newMessage]);
          setMessages((prev) =>
            prev.some((m) => m.id === decrypted.id)
              ? prev
              : [...prev, decrypted]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Auto-scroll
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch projects from Supabase on component mount
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("projects")
          .select("*");

        if (fetchError) {
          console.error("Error fetching projects from Supabase:", fetchError);
          setError(`Failed to load projects: ${fetchError.message}`);
          return;
        }

        // Parse JSON fields that are stored as strings in Supabase
        const processedProjects =
          data?.map((project) => {
            // Parse techstack and map icon strings to React components
            let techstack = safeJsonParse(project.techstack, []);
            if (Array.isArray(techstack)) {
              techstack = techstack.map((tech: any) => ({
                ...tech,
                icon:
                  iconMap[tech.icon] ||
                  (() => <span className="text-xs">?</span>),
              }));
            }
            return {
              ...project,
              techstack,
              tags: safeJsonParse(project.tags, []),
              description: safeJsonParse(project.description, {}),
              gallery: safeJsonParse(project.gallery, []),
            };
          }) || [];

        setProjects(processedProjects);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred while loading projects");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Contact data
  const contactData: {
    name: string;
    Icon: React.ElementType;
    description: string;
    link: string;
    color: string;
    hoverBg: string;
    buttonLabel: string;
  }[] = [
    {
      name: "Email Address",
      Icon: Mail,
      description:
        "Send me a direct email for professional or personal inquiries.",
      link: "mailto:mail.christianluisaceron@yahoo.com",
      color: "text-red-400",
      hoverBg: "hover:bg-red-600/20",
      buttonLabel: "Send me an email",
    },
    {
      name: "LinkedIn Profile",
      Icon: Linkedin,
      description:
        "Connect with me professionally and view my full career history and experience.",
      link: "https://www.linkedin.com/in/christianluisaceron",
      color: "text-blue-500",
      hoverBg: "hover:bg-blue-600/20",
      buttonLabel: "Connect with me",
    },
    {
      name: "GitHub Repositories",
      Icon: Github,
      description:
        "Explore my open-source projects, contributions, and code repositories.",
      link: "https://github.com/aceaceron",
      color: "text-gray-300",
      hoverBg: "hover:bg-gray-700/20",
      buttonLabel: "View Repositories",
    },
    {
      name: "Facebook Page",
      Icon: Facebook,
      description:
        "Follow my personal updates and social activity on this platform.",
      link: "https://www.facebook.com/christianluisaceron",
      color: "text-blue-400",
      hoverBg: "hover:bg-blue-500/20",
      buttonLabel: "Visit my Facebook",
    },
    {
      name: "Google Developers Account",
      Icon: FcGoogle,
      description:
        "Check out my profile, articles, or contributions on Google Developer platforms.",
      link: "https://developers.google.com/profile/u/aceaceron",
      color: "text-yellow-400",
      hoverBg: "hover:bg-yellow-600/20",
      buttonLabel: "View My Dev Profile",
    },
  ];
  // Fetch certifications from Supabase
  useEffect(() => {
    async function fetchCertifications() {
      try {
        setCertsLoading(true);
        setCertsError(null);

        const { data, error: fetchError } = await supabase
          .from("certifications")
          .select("*")
          .order("date_earned", { ascending: false });

        if (fetchError) {
          console.error(
            "Error fetching certifications from Supabase:",
            fetchError
          );
          setCertsError(`Failed to load certifications: ${fetchError.message}`);
          return;
        }

        setCertifications(data || []);
      } catch (err) {
        console.error("Unexpected error:", err);
        setCertsError(
          "An unexpected error occurred while loading certifications"
        );
      } finally {
        setCertsLoading(false);
      }
    }

    fetchCertifications();
  }, []);

  const pinnedProjects = projects.filter((project) => project.pinned);
  const pinnedCertifications = certifications.filter((cert) => cert.pinned);

  return (
    <div className="md:ml-64 pt-0 px-8 pb-0">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        custom={0}
        viewport={{ once: true, amount: 0.2 }}
      >
        <Hero />
      </motion.div>

      {/* Featured Projects Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        custom={1}
        viewport={{ once: true, amount: 0.2 }}
        className="mt-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Folder size={24} className="text-[#FFD700]" /> Projects
          </h2>
          <a
            href="/projects"
            className="px-4 py-2 bg-[#FFD700] text-black rounded hover:bg-yellow-500 transition"
          >
            View All
          </a>
        </div>
        <p className="text-gray-300 mb-4">
          Explore some of the projects I have worked on, showcasing my skills in
          software development and problem solving.
        </p>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-600 rounded">
            <p className="text-red-200">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-3 py-1 bg-red-700 text-white text-sm rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="text-gray-400">Loading projects...</div>
          </div>
        )}

        {/* No Projects State */}
        {!loading && !error && pinnedProjects.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No pinned projects found.</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && pinnedProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pinnedProjects.map((project) => (
              <ProjectCard
                key={project.slug}
                title={project.title}
                description={project.brief}
                tags={Array.isArray(project.tags) ? project.tags : []}
                thumbnail={project.thumbnail}
                pinned={project.pinned}
                projectLink={`/projects/${project.slug}`}
                slug={project.slug}
                techStack={
                  Array.isArray(project.techstack) ? project.techstack : []
                }
              />
            ))}
          </div>
        )}
        <hr className="mt-6 border-[#FFD700]" />
      </motion.section>

      {/* Skills Section */}
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
          These are the technical skills and technologies I am proficient in,
          ranging from front-end to back-end development.
        </p>
        <SkillsShowcase />
        <hr className="mt-6 border-[#FFD700]" />
      </motion.section>

      {/* Certifications Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        custom={3}
        viewport={{ once: true, amount: 0.2 }}
        className="mt-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Award size={24} className="text-[#FFD700]" /> Certifications
          </h2>
          <a
            href="/certifications"
            className="px-4 py-2 bg-[#FFD700] text-black rounded hover:bg-yellow-500 transition"
          >
            View All
          </a>
        </div>
        <p className="text-gray-300 mb-4">
          Recognized certifications that demonstrate my commitment in learning.
        </p>

        {/* Error State */}
        {certsError && (
          <div className="mb-6 p-4 bg-red-900 border border-red-600 rounded">
            <p className="text-red-200">{certsError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-3 py-1 bg-red-700 text-white text-sm rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {certsLoading && (
          <div className="flex justify-center py-12">
            <div className="text-gray-400">Loading certifications...</div>
          </div>
        )}

        {/* No Certifications State */}
        {!certsLoading && !certsError && pinnedCertifications.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No pinned certifications found.</p>
          </div>
        )}

        {/* Certifications Grid */}
        {!certsLoading && !certsError && pinnedCertifications.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pinnedCertifications.map((cert, index) => (
              <CertificationCard
                key={cert.id || cert.slug}
                title={cert.title}
                org={cert.org}
                year={
                  cert.date_earned
                    ? new Date(cert.date_earned).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : ""
                }
                thumbnail={cert.thumbnail}
                pinned={cert.pinned}
                index={index}
                credentialId={cert.credential_id}
                credentialUrl={cert.credential_url}
              />
            ))}
          </div>
        )}

        <hr className="mt-6 border-[#FFD700]" />
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        custom={3}
        viewport={{ once: true, amount: 0.2 }}
        className="mt-6"
      >
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <HiOutlineChat size={24} className="text-[#FFD700]" /> Chat Hub
        </h2>
        <p className="text-gray-300 mb-4">
          Share your thoughts on my portfolio and hop into the chat hub!
        </p>
        <GlowingCardWrapper onClick={() => router.push("/chat")}>
          <ChatMessages
            messages={messages}
            customSession={customSession}
            isLoading={isLoading}
            onDelete={() => {}}
            messagesEndRef={messagesEndRef}
            containerRef={messagesContainerRef}
          />
        </GlowingCardWrapper>
        <hr className="mt-6 border-[#FFD700]" />
      </motion.section>

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
            <div className="flex justify-between">
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
    </div>
  );
}
