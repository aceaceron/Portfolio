import * as React from "react";
import { motion } from "framer-motion";
import GlowingCardWrapper from "../GlowingCardWrapper";
import ProjectCardAnimationWrapper from "../CardAnimationWrapper";

type Tech = {
  name: string;
  icon?: any;
  bgColor?: string;
};

type Project = {
  slug: string;
  title: string;
  brief?: string;
  thumbnail?: string;
  pinned?: boolean;
  category?: string;
  year?: number;
  status?: string;
  tags?: string[];
  techStack?: Tech[];
};

type ProjectCardProps = {
  project: Project;
  onStatusClick: (status: string, e: React.MouseEvent) => void;
  onCategoryClick: (category: string, e: React.MouseEvent) => void;
  onTagOrTechClick: (value: string, e: React.MouseEvent) => void;
};

export default function ProjectCard({
  project,
  onStatusClick,
  onCategoryClick,
  onTagOrTechClick,
}: ProjectCardProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Live Demo Available":
        return "bg-green-500 text-white hover:bg-green-600";
      case "In Development":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "Archived":
        return "bg-gray-500 text-white hover:bg-gray-600";
      case "Completed":
        return "bg-blue-500 text-white hover:bg-blue-600";
      default:
        return "bg-gray-600 text-white hover:bg-gray-700";
    }
  };

  return (
    <ProjectCardAnimationWrapper>
      <div
        className="block h-full cursor-pointer"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (
            !target.closest(".tag") &&
            !target.closest(".tech-icon") &&
            !target.closest(".status-badge") &&
            !target.closest(".category-badge")
          ) {
            window.location.href = `/projects/${project.slug}`;
          }
        }}
      >
<GlowingCardWrapper className="rounded-lg overflow-hidden flex flex-col h-full bg-gray-800 border border-gray-600 text-gray-100">
  {project.thumbnail && (
    <div className="relative w-full aspect-w-16 aspect-h-9">
      <img
        src={project.thumbnail}
        alt={project.title + " thumbnail"}
        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
      />
      {project.pinned && (
        <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow-md">
          Pinned
        </span>
      )}
    </div>
  )}
  <div className="p-4 flex flex-col flex-grow">
    {project.category && (
      <span
        onClick={(e) => onCategoryClick(project.category!, e)}
        className="category-badge text-gray-400 text-sm cursor-pointer hover:text-[#FFD700] transition-colors mb-1"
      >
        {project.category}
      </span>
    )}

    <h3 className="font-semibold text-lg text-gray-100 leading-snug">
      {project.title}
      {project.year && (
        <span className="ml-2 text-gray-400 text-sm whitespace-nowrap">
          • {project.year}
        </span>
      )}
    </h3>

    {project.brief && (
      <p className="text-sm text-gray-300 mt-2">{project.brief}</p>
    )}

    {project.status && (
      <span
        onClick={(e) => onStatusClick(project.status!, e)}
        className={`status-badge mt-2 w-fit inline-block text-xs px-3 py-1 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-105 ${getStatusStyles(
          project.status
        )}`}
      >
        {project.status}
      </span>
    )}

    {(project.tags ?? []).length > 0 && (
      <div className="flex gap-2 mt-3 flex-wrap">
        {(project.tags ?? []).map((t) => (
          <span
            key={t}
            onClick={(e) => onTagOrTechClick(t, e)}
            className="tag px-3 py-1 text-sm border border-white rounded-full text-white hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer"
          >
            {t}
          </span>
        ))}
      </div>
    )}

    {(project.techStack ?? []).length > 0 && (
      <div className="mt-4 flex flex-wrap gap-2">
        {(project.techStack ?? []).map((tech, index) => {
          const Icon = tech.icon;
          return (
            <motion.div
              key={`${project.slug}-${tech.name}-${index}`}
              onClick={(e) => onTagOrTechClick(tech.name, e)}
              className="tech-icon flex flex-col items-center cursor-pointer group"
              style={{ width: "44px" }}
              whileHover={{ scale: 1.1 }}
            >
              <div
                className={`w-9 h-9 rounded-full border-2 border-[#FFD700] ${
                  tech.bgColor || "bg-gray-600"
                } flex items-center justify-center text-white`}
              >
                {Icon ? <Icon size={16} /> : <span className="text-[10px]">?</span>}
              </div>
              <span className="mt-1 text-white text-[10px] font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {tech.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    )}
  </div>
</GlowingCardWrapper>

      </div>
    </ProjectCardAnimationWrapper>
  );
}
