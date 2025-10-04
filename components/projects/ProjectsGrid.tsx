import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "./ProjectCard";

import { Project } from "../../app/projects/ProjectsClientPage"; 

type ProjectsGridProps = {
  projects: Project[];
  showNoProjects?: boolean;
  onStatusClick: (status: string, e: React.MouseEvent) => void;
  onCategoryClick: (category: string, e: React.MouseEvent) => void;
  onTagOrTechClick: (value: string, e: React.MouseEvent) => void;
};

export default function ProjectsGrid({
  projects,
  showNoProjects,
  onStatusClick,
  onCategoryClick,
  onTagOrTechClick,
}: ProjectsGridProps) {
  
  const sortedProjects = React.useMemo(() => {
    // We now always use the public sorting logic: pinned first, then by idx.
    const projectsToDisplay = [...projects]; 

    return projectsToDisplay.sort((a, b) => {
      // Primary Sort: Pinned Status (TRUE comes before FALSE)
      if (a.pinned !== b.pinned) {
        return b.pinned ? 1 : -1;
      }
      // Secondary Sort: If pinned status is the same, sort by idx (ascending)
      return a.idx - b.idx;
    });
  }, [projects]); 

  return (
    <div className="grid grid-cols-1 md:col-span-2 gap-6">
      <AnimatePresence>
        {sortedProjects.length > 0 ? (
          sortedProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              onStatusClick={onStatusClick}
              onCategoryClick={onCategoryClick}
              onTagOrTechClick={onTagOrTechClick}
            />
          ))
        ) : !showNoProjects ? (
          <div className="col-span-1 md:col-span-2 flex justify-center flex-wrap gap-6 py-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                className="rounded-lg bg-gray-700 h-64 w-full md:w-96 animate-pulse"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="col-span-1 md:col-span-2 text-center text-gray-500 py-12"
          >
            <p>No projects match your current search and filters.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}