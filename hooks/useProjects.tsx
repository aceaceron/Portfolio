"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.client";
import { safeJsonParse } from "../utils/json";
import { iconMap } from "../utils/icons";

export default function useProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("projects")
          .select("*");

        if (fetchError) {
          setError(`Failed to load projects: ${fetchError.message}`);
          return;
        }

        const processedProjects =
          data?.map((project) => {
            let techstack = safeJsonParse(project.techstack, []);
            if (Array.isArray(techstack)) {
              techstack = techstack.map((tech: any) => ({
                ...tech,
                icon:
                  iconMap[tech.icon] ||
                  (() => <span className="text-xs">?</span>),
              }));
            }
            return {
              ...project,
              techstack,
              tags: safeJsonParse(project.tags, []),
              description: safeJsonParse(project.description, {}),
              gallery: safeJsonParse(project.gallery, []),
            };
          }) || [];

        setProjects(processedProjects);
      } catch (err) {
        setError("An unexpected error occurred while loading projects");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return { projects, loading, error };
}
