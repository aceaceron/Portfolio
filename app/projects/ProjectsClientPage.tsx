"use client";
import { useState, useEffect } from "react";
import { Folder } from "lucide-react";
import { motion } from "framer-motion";
import SearchBar from "../../components/projects/SearchBar";
import FilterPanel from "../../components/projects/FilterPanel";
import ProjectsGrid from "../../components/projects/ProjectsGrid";
import { useProjects } from "../../components/projects/useProjects";
import { useProjectFilters } from "../../components/projects/useProjectFilters";
import type { Project } from "../../types/projects";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProjectsPage() {
  
  const { 
    projects,
    categories,
    years,
    statuses
  } = useProjects() as {
    projects: Project[];
    categories: string[];
    years: string[];
    statuses: string[];
  };

  const {
    search,
    setSearch,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    filteredProjects,
  } = useProjectFilters(projects);

  const [showNoProjects, setShowNoProjects] = useState(false);

  // Show "No projects" after delay
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!projects || projects.length === 0) {
      timer = setTimeout(() => setShowNoProjects(true), 1000);
    } else if (filteredProjects.length === 0) {
      timer = setTimeout(() => setShowNoProjects(true), 1000);
    } else {
      setShowNoProjects(false);
    }

    return () => clearTimeout(timer);
  }, [projects, filteredProjects]);

  const handleStatusClick = (status: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFilters({ ...filters, status });
    setShowFilters(true);
  };

  const handleCategoryClick = (category: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFilters({ ...filters, category });
    setShowFilters(true);
  };

  const handleTagOrTechClick = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSearch(value);
    setShowFilters(true);
  };

  return (
    <motion.div
      className="md:ml-64 px-6 pb-6 pt-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        
        <div className="flex items-center gap-2 mb-2">
          <Folder className="w-7 h-7 text-yellow-400" />
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600">
            Projects
          </h1>
        </div>
        <p className="text-gray-300 mb-4">
          A collection of my works including web systems, games, and designs.
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <hr className="border-t-2 border-[#FFD700] mb-6" />
      </motion.div>

      <div className="mb-6 relative">
        <SearchBar
          search={search}
          onSearchChange={setSearch}
          onFocus={() => setShowFilters(true)}
        />

        <FilterPanel
          showFilters={showFilters}
          filters={filters}
          categories={categories}
          years={years}
          statuses={statuses}
          onFilterChange={setFilters}
        />
      </div>

      <ProjectsGrid
        projects={filteredProjects} 
        showNoProjects={showNoProjects}
        onStatusClick={handleStatusClick}
        onCategoryClick={handleCategoryClick}
        onTagOrTechClick={handleTagOrTechClick}
      />
    </motion.div>
  );
}