import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type FilterState = {
  category: string;
  year: string;
  status: string;
};

type Tech = {
  name: string;
  icon?: any;
  bgColor?: string;
};

type Project = {
  // 💥 FIX: ADD THE REQUIRED 'id' PROPERTY HERE
  id: number;
  slug: string;
  title: string;
  brief?: string;
  thumbnail?: string;
  pinned?: boolean;
  category?: string;
  // Note: project.year is number here, but filters.year is string.
  year?: number; 
  status?: string;
  tags?: string[];
  techStack?: Tech[];
  idx: number; 
};

export function useProjectFilters(projects: Project[]) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    year: "",
    status: "",
  });

  // Sync search with URL params
  useEffect(() => setSearch(initialSearch), [initialSearch]);

  // Sync filters with URL params
  useEffect(() => {
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";
    const year = searchParams.get("year") || "";
    const showFiltersParam = searchParams.get("showFilters");

    setFilters({ status, category, year });

    if (status || category || year || showFiltersParam === "true") {
      setShowFilters(true);
    }
  }, [searchParams]);

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title?.toLowerCase().includes(search.toLowerCase()) ||
      (project.tags ?? []).some((tag) =>
        tag.toLowerCase().includes(search.toLowerCase())
      ) ||
      (project.techStack ?? []).some((tech) =>
        tech.name.toLowerCase().includes(search.toLowerCase())
      );

    const matchesCategory =
      !filters.category || project.category === filters.category;
    const matchesYear =
      !filters.year || project.year?.toString() === filters.year;
    const matchesStatus = !filters.status || project.status === filters.status;

    return matchesSearch && matchesCategory && matchesYear && matchesStatus;
  });

  return {
    search,
    setSearch,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    filteredProjects,
  };
}