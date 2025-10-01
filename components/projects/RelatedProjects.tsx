import * as React from "react";
import ProjectCard from "../home/ProjectCard";

type Tech = {
  name: string;
  icon?: any;
  bgColor?: string;
};

type Project = {
  slug: string;
  title: string;
  brief?: string;
  tags?: string[];
  techStack?: Tech[];
  thumbnail?: string;
};

type RelatedProjectsProps = {
  projects: Project[];
};

export default function RelatedProjects({ projects }: RelatedProjectsProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">
        Check out other projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <ProjectCard
            key={proj.slug}
            title={proj.title}
            description={proj.brief}
            tags={proj.tags}
            thumbnail={proj.thumbnail}
            projectLink={`/projects/${proj.slug}`}
            slug={proj.slug}
            techStack={proj.techStack as any}
          />
        ))}
      </div>
    </div>
  );
}