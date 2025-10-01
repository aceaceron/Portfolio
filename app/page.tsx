"use client";
import { useEffect, useState } from "react";
import Hero from "../components/home/Hero";
import ProjectCard from "../components/home/ProjectCard";
import SkillsGrid from "../components/SkillsGrid";
import CertificationCard from "../components/home/CertificationCard";
import { Folder, Code, Award } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase.client";
import { FaHtml5, FaCss3, FaJs, FaReact, FaPhp, FaNodeJs, FaPython } from "react-icons/fa";
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
  SiFlask
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

// Helper function to safely parse JSON strings
function safeJsonParse(jsonString: string | any, fallback: any = null) {
  if (typeof jsonString === 'string') {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.warn('Failed to parse JSON:', jsonString, e);
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

  // Fetch projects from Supabase on component mount
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase.from("projects").select("*");
        
        if (fetchError) {
          console.error("Error fetching projects from Supabase:", fetchError);
          setError(`Failed to load projects: ${fetchError.message}`);
          return;
        }
        
        // Parse JSON fields that are stored as strings in Supabase
        const processedProjects = data?.map((project) => {
          // Parse techstack and map icon strings to React components
          let techstack = safeJsonParse(project.techstack, []);
          if (Array.isArray(techstack)) {
            techstack = techstack.map((tech: any) => ({
              ...tech,
              icon: iconMap[tech.icon] || (() => <span className="text-xs">?</span>)
            }));
          }
          return {
            ...project,
            techstack,
            tags: safeJsonParse(project.tags, []),
            description: safeJsonParse(project.description, {}),
            gallery: safeJsonParse(project.gallery, [])
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

  // Fetch certifications from Supabase
  useEffect(() => {
    async function fetchCertifications() {
      try {
        setCertsLoading(true);
        setCertsError(null);
        
        const { data, error: fetchError } = await supabase
          .from("certifications")
          .select("*")
          .order('date_earned', { ascending: false });
        
        if (fetchError) {
          console.error("Error fetching certifications from Supabase:", fetchError);
          setCertsError(`Failed to load certifications: ${fetchError.message}`);
          return;
        }
        
        setCertifications(data || []);
      } catch (err) {
        console.error("Unexpected error:", err);
        setCertsError("An unexpected error occurred while loading certifications");
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
                techStack={Array.isArray(project.techstack) ? project.techstack : []}
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
        <SkillsGrid />
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
                year={cert.date_earned ? new Date(cert.date_earned).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : ""}
                thumbnail={cert.thumbnail}
                pinned={cert.pinned}
                index={index}
                credentialId={cert.credential_id}
                credentialUrl={cert.credential_url}
              />
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}