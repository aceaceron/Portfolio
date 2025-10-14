// types/projects.ts

export type Tech = {
  name: string;
  icon?: any;
  bgColor?: string;
};

export type FeaturesType = Record<string, string[]>;

export type ProjectDescriptionType = {
  introduction?: string;
  objectives?: string[];
  features?: FeaturesType;
  challenges?: string[];
  results_benefits?: string;
  itemVariants?: any;
  tech_stack_description?: Record<string, string[]>;
  hardware_components?: Record<string, string[]>;
};

// ✅ General Project type (used in lists, grid, filters, etc.)
export type Project = {
  id?: number; // optional, because ProjectDetail may not fetch id
  slug: string;
  title: string;
  brief?: string;
  description?: ProjectDescriptionType;
  tags?: string[];
  techStack?: Tech[];
  github?: string;
  liveDemo?: string;
  gallery?: string[];
  thumbnail?: string;
  category?: string;
  year?: string;
  status?: string;
  pinned?: boolean;
  idx: number; 
};

// Optional: useProjects hook return type
export type ProjectsResponse = {
  projects: Project[];
  categories: string[];
  years: string[];
  statuses: string[];
};

export type ProjectDetailClientProps = {
  slug: string;
};

export type ProjectCardProps = {
  project: Project;
  onStatusClick: (status: string, e: React.MouseEvent) => void;
  onCategoryClick: (category: string, e: React.MouseEvent) => void;
  onTagOrTechClick: (value: string, e: React.MouseEvent) => void;
};