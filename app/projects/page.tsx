import { Suspense } from "react";
import ProjectsClientPage from "./ProjectsClientPage";

// Skeleton loader for project cards
const SkeletonCard = () => (
  <div className="rounded-lg bg-gray-700 animate-pulse h-64 w-full md:w-80 m-4" />
);

const ProjectsLoading = () => (
  <div className="md:ml-64 px-6 pb-6 pt-0 flex flex-wrap justify-center min-h-screen gap-4">
    {Array.from({ length: 6 }).map((_, idx) => (
      <SkeletonCard key={idx} />
    ))}
  </div>
);


export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsLoading />}>
      <ProjectsClientPage />
    </Suspense>
  );
}
