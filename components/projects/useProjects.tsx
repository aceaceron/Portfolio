import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase.client";
import { iconMap } from "../../utils/icons";

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
  idx: number; 
};

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase.from("projects").select("*");
      if (error) return console.error("Supabase fetch error:", error);
      if (!data) return;

      const parsedProjects: Project[] = (data as any[]).map((p) => {
        let techStack: Tech[] = [];
        let tags: string[] = [];

        // Parse techstack
        if (p.techstack) {
          try {
            let parsed =
              typeof p.techstack === "string"
                ? JSON.parse(p.techstack)
                : p.techstack;
            if (Array.isArray(parsed)) {
              techStack = parsed.map((t: any) => ({
                ...t,
                icon: iconMap[t.icon as string],
              }));
            }
          } catch (e) {
            console.warn("Techstack parse error for", p.slug, e);
          }
        }

        // Parse tags
        if (p.tags) {
          try {
            let parsedTags =
              typeof p.tags === "string" ? JSON.parse(p.tags) : p.tags;
            if (Array.isArray(parsedTags))
              tags = parsedTags.map((t: string) => t.trim());
          } catch (e) {
            if (typeof p.tags === "string")
              tags = p.tags.split(",").map((t: string) => t.trim());
          }
        }

        return { ...p, techStack, tags };
      });

      setProjects(parsedProjects);

      // Extract unique values
      const uniqueCategories = Array.from(
        new Set(
          parsedProjects
            .map((p) => p.category)
            .filter((c): c is string => Boolean(c))
        )
      );
      const uniqueYears = Array.from(
        new Set(
          parsedProjects
            .map((p) => p.year?.toString())
            .filter((y): y is string => Boolean(y))
        )
      );
      const uniqueStatuses = Array.from(
        new Set(
          parsedProjects
            .map((p) => p.status)
            .filter((s): s is string => Boolean(s))
        )
      );

      setCategories(uniqueCategories);
      setYears(uniqueYears);
      setStatuses(uniqueStatuses);
    }

    fetchProjects();
  }, []);

  return { projects, categories, years, statuses };
}