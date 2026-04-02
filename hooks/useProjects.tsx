"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.client";
import { safeJsonParse } from "../utils/json";
import { iconMap } from "../utils/icons";

const FallbackIcon = () => <span className="text-xs">?</span>;

function resolveIcon(iconKey: string) {
  return iconMap[iconKey] || FallbackIcon;
}

export default function useProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("projects")
          .select("*");

        if (fetchError) {
          if (!cancelled) setError(`Failed to load projects: ${fetchError.message}`);
          return;
        }

        const processed =
          data?.map((project) => {
            let techstack = safeJsonParse(project.techstack, []);
            if (Array.isArray(techstack)) {
              techstack = techstack.map((tech: any) => ({
                ...tech,
                icon: resolveIcon(tech.icon),
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

        if (!cancelled) setProjects(processed);
      } catch {
        if (!cancelled) setError("An unexpected error occurred while loading projects");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProjects();
    return () => { cancelled = true; };
  }, []);

  return { projects, loading, error };
}