"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase.client";
import CardAnimationWrapper from "../../../components/CardAnimationWrapper";
import ProjectHeader from "../../../components/projects/ProjectHeader";
import ProjectTags from "../../../components/projects/ProjectTags";
import ProjectTechStack from "../../../components/projects/ProjectTechStack";
import ProjectLinks from "../../../components/projects/ProjectLinks";
import ProjectDescription from "../../../components/projects/ProjectDescription";
import ProjectGallery from "../../../components/projects/ProjectGallery";
import RelatedProjects from "../../../components/projects/RelatedProjects";
import ProjectDetailSkeleton from "../../../components/projects/ProjectDetailSkeleton";
import ProjectErrorState from "../../../components/projects/ProjectErrorState";

// import all icons from your centralized icons file
import { iconMap } from "../../../utils/icons";

type Tech = {
  name: string;
  icon?: any;
  bgColor?: string;
};

type FeaturesType = Record<string, string[]>;

type ProjectDescriptionType = {
  introduction?: string;
  objectives?: string[];
  features?: FeaturesType;
  challenges?: string[];
  results_benefits?: string;
  tech_stack_description?: Record<string, string[]>;
};

type Project = {
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
};

type ProjectDetailClientProps = {
  slug: string;
};


const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProjectDetailClient({
  slug,
}: ProjectDetailClientProps) {
  const [project, setProject] = React.useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) {
          setError("Failed to fetch project data");
          return;
        }

        if (data) {
          let tags: string[] = [];
          let description: ProjectDescriptionType = {};
          let gallery: string[] = [];
          let techStack: Tech[] = [];

          if (typeof data.description === "object" && data.description !== null) {
            description = {
              ...data.description,
              features: data.description.features as FeaturesType,
            };
          }

          if (data.tech_stack_description && typeof data.tech_stack_description === "object") {
            description.tech_stack_description = data.tech_stack_description;
          }

          if (data.techstack) {
            try {
              const parsed =
                typeof data.techstack === "string" ? JSON.parse(data.techstack) : data.techstack;
              if (Array.isArray(parsed)) {
                techStack = parsed.map((t: any) => ({
                  name: t.name,
                  bgColor: t.bgColor,
                  icon: iconMap[t.icon] || undefined,
                }));
              }
            } catch (e) {
              console.warn("Techstack parse error for project:", data.slug, e);
            }
          }

          if (Array.isArray(data.tags)) {
            tags = data.tags.map((tag: string) => tag.trim());
          }

          if (Array.isArray(data.gallery)) {
            gallery = data.gallery;
          }

          const parsedProject: Project = {
            slug: data.slug,
            title: data.title,
            brief: data.brief,
            description,
            tags,
            techStack,
            github: data.github,
            liveDemo: data.livedemo,
            gallery,
            thumbnail: data.thumbnail,
            category: data.category,
            year: data.year,
            status: data.status,
          };

          setProject(parsedProject);
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    async function fetchOtherProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("slug, title, brief, tags, techstack, thumbnail")
          .neq("slug", slug);

        if (error) {
          console.error("Error fetching other projects:", error);
          return;
        }

        if (data) {
          const shuffled = data.sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 2);
          setRelatedProjects(selected);
        }
      } catch (err) {
        console.error("Unexpected error fetching other projects:", err);
      }
    }

    fetchProject();
    fetchOtherProjects();
  }, [slug]);

  const handleFilterClick = (value: string) => {
    router.push(`/projects?search=${encodeURIComponent(value)}`);
  };

  const handleStatusClick = (status: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/projects?status=${encodeURIComponent(status)}&showFilters=true`);
  };

  const handleCategoryClick = (category: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/projects?category=${encodeURIComponent(category)}&showFilters=true`);
  };

  if (loading) return <ProjectDetailSkeleton />;

  if (error || !project) {
    return (
      <ProjectErrorState
        error={error || "Project not found."}
        onRefresh={() => router.refresh()}
      />
    );
  }

  return (
    <CardAnimationWrapper className="md:ml-64 px-6 pb-6 pt-0">
      <ProjectHeader
        title={project.title}
        year={project.year}
        category={project.category}
        brief={project.brief}
        status={project.status}
        onCategoryClick={handleCategoryClick}
        onStatusClick={handleStatusClick}
        itemVariants={itemVariants}
      />

      <ProjectTags
        tags={project.tags ?? []}
        onTagClick={handleFilterClick}
        itemVariants={itemVariants}
      />

      <ProjectTechStack
        techStack={project.techStack ?? []}
        onTechClick={handleFilterClick}
        itemVariants={itemVariants}
      />

      <ProjectLinks
        github={project.github}
        liveDemo={project.liveDemo}
        itemVariants={itemVariants}
      />

      <ProjectDescription
        introduction={project.description?.introduction}
        objectives={project.description?.objectives}
        features={project.description?.features}
        challenges={project.description?.challenges}
        results_benefits={project.description?.results_benefits}
        tech_stack_description={project.description?.tech_stack_description}
        itemVariants={itemVariants}
      />

      <ProjectGallery
        gallery={project.gallery ?? []}
        projectTitle={project.title}
        itemVariants={itemVariants}
      />

      <hr className="border-t-2 border-[#FFD700] my-12" />

      <RelatedProjects projects={relatedProjects} />
    </CardAnimationWrapper>
  );
}
