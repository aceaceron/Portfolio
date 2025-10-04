"use client";
import { motion } from "framer-motion";
import { Folder } from "lucide-react";
import ProjectCard from "./ProjectCard";
import useProjects from "../../hooks/useProjects";

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

export default function ProjectsSection() {
  const { projects, loading, error } = useProjects();
  const pinnedProjects = projects.filter((p) => p.pinned);

  return (
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
        Explore some of the projects I have worked on.
      </p>

      {error && <div className="text-red-400">{error}</div>}
      {loading && <div className="text-gray-400">Loading projects...</div>}
      {!loading && !error && pinnedProjects.length === 0 && (
        <div className="text-gray-400">No pinned projects found.</div>
      )}
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
  );
}
