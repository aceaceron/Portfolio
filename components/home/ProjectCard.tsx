"use client";
import { JSX, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconType } from "react-icons";
import { ChevronRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { FaHtml5, FaCss3, FaJs, FaReact, FaPhp, FaNodeJs, FaPython } from "react-icons/fa";
import { 
  SiNextdotjs, 
  SiTailwindcss, 
  SiSupabase, 
  SiMysql, 
  SiPostgresql,
  SiMongodb,
  SiTypescript,
  SiExpress,
  SiDjango,
  SiFlask
} from "react-icons/si";

// Enhanced icon mapping with more technologies
const iconMap: Record<string, any> = {
  FaHtml5,
  FaCss3,
  FaJs,
  FaReact,
  FaPhp,
  FaNodeJs,
  FaPython,
  SiNextdotjs,
  SiTailwindcss,
  SiSupabase,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiTypescript,
  SiExpress,
  SiDjango,
  SiFlask,
};

type Skill = {
  name: string;
  icon: IconType | (() => JSX.Element);
  bgColor: string;
};

type Props = {
  title: string;
  description?: string;
  tags?: string[];
  thumbnail?: string;
  pinned?: boolean;
  projectLink?: string;
  techStack?: Skill[];
  isSinglePinned?: boolean;
  projectId?: string; // Add project ID to fetch from Supabase
  slug?: string; // Alternative identifier
};

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProjectCard({
  title,
  description,
  tags = [],
  thumbnail,
  pinned = false,
  projectLink = "#",
  techStack: initialTechStack = [],
  isSinglePinned = false,
  projectId,
  slug,
}: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [techStack, setTechStack] = useState<Skill[]>(initialTechStack);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const widthClass = isSinglePinned ? "w-full lg:max-w-4xl" : "w-full";

  // Function to fetch tech stack from Supabase
  const fetchTechStack = async () => {
    if (!projectId && !slug) {
      console.warn("No projectId or slug provided for tech stack fetching");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase.from("projects").select("techstack");
      
      if (projectId) {
        query = query.eq("id", projectId);
      } else if (slug) {
        query = query.eq("slug", slug);
      }

      const { data, error: fetchError } = await query.single();

      if (fetchError) {
        console.error("Supabase fetch error:", fetchError);
        setError(`Failed to fetch tech stack: ${fetchError.message}`);
        return;
      }

      if (data && data.techstack) {
        
        let parsedTechStack: Skill[] = [];

        // Handle different data structures
        if (Array.isArray(data.techstack)) {
          parsedTechStack = data.techstack.map((tech: any) => {
            // Handle different possible structures
            if (typeof tech === "string") {
              // If tech is just a string, create a basic tech object
              return {
                name: tech,
                icon: iconMap[tech] || (() => <span>?</span>),
                bgColor: "bg-gray-600"
              };
            } else if (typeof tech === "object" && tech !== null) {
              // If tech is an object with properties
              return {
                name: tech.name || "Unknown",
                icon: iconMap[tech.icon] || (() => <span>?</span>),
                bgColor: tech.bgColor || "bg-gray-600"
              };
            }
            return {
              name: "Unknown",
              icon: () => <span>?</span>,
              bgColor: "bg-gray-600"
            };
          });
        } else if (typeof data.techstack === "string") {
          // If techstack is stored as a JSON string, parse it
          try {
            const parsed = JSON.parse(data.techstack);
            if (Array.isArray(parsed)) {
              parsedTechStack = parsed.map((tech: any) => ({
                name: tech.name || tech,
                icon: iconMap[tech.icon] || iconMap[tech] || (() => <span>?</span>),
                bgColor: tech.bgColor || "bg-gray-600"
              }));
            }
          } catch (parseError) {
            console.error("Failed to parse techstack JSON string:", parseError);
            setError("Failed to parse tech stack data");
          }
        }
        setTechStack(parsedTechStack);
      } else {
        console.warn("No techstack data found for project");
        setTechStack([]);
      }
    } catch (err) {
      console.error("Error fetching tech stack:", err);
      setError("An unexpected error occurred while fetching tech stack");
    } finally {
      setLoading(false);
    }
  };

  // Fetch tech stack on component mount if projectId or slug is provided
  useEffect(() => {
    if ((projectId || slug) && initialTechStack.length === 0) {
      fetchTechStack();
    }
  }, [projectId, slug]);

  // Debug logging
  useEffect(() => {}, [title, projectId, slug, techStack, loading, error]);

  const handleCardInteraction = (flip: boolean) => {
    setIsFlipped(flip);
    // Fetch tech stack when card is about to flip if not already loaded
    if (flip && techStack.length === 0 && !loading && (projectId || slug)) {
      fetchTechStack();
    }
  };

  return (
    <div
      className={`relative ${widthClass} perspective cursor-pointer`}
      style={{ perspective: 1200 }}
      onMouseEnter={() => handleCardInteraction(true)}
      onMouseLeave={() => handleCardInteraction(false)}
      onClick={() => handleCardInteraction(!isFlipped)}
    >
      <motion.div
        className="relative w-full rounded-lg shadow-lg"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Front Side */}
        <div
          className="rounded-lg overflow-hidden bg-gray-800 border border-gray-600 text-gray-100"
          style={{ backfaceVisibility: "hidden" }}
        >
          {thumbnail && (
            <div className="relative w-full h-48">
              <img
                src={thumbnail}
                alt={title + " thumbnail"}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  console.error("Image failed to load:", thumbnail);
                  (e.target as HTMLImageElement).src = "/placeholder-project.png";
                }}
              />
              {pinned && (
                <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow-md">
                  Pinned
                </span>
              )}
            </div>
          )}
          <div className="p-4 flex flex-col h-full justify-between">
            <div>
              <h3 className="font-semibold text-lg">{title}</h3>
              {description && (
                <p className="text-sm text-gray-300 mt-2">{description}</p>
              )}
              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 text-sm border border-white rounded-full text-white hover:bg-white hover:text-black transition-colors duration-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end"></div>
          </div>
        </div>

        {/* Back Side */}
        <div
          className="absolute inset-0 rounded-lg overflow-auto shadow-lg bg-gray-900 text-white border border-gray-600 p-4 flex flex-col justify-between h-full"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div>
            <h3 className="text-xl font-semibold mb-2">Tech Stack</h3>
            
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center h-20">
                <div className="text-gray-400">Loading tech stack...</div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex flex-col items-center justify-center h-20">
                <div className="text-red-400 text-sm mb-2">{error}</div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    fetchTechStack();
                  }}
                  className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Tech Stack Display */}
            {!loading && !error && (
              <div className="flex flex-wrap gap-3"> {/* slightly larger gap */}
                {techStack.length > 0 ? (
                  techStack.map((tech, index) => {
                    const Icon = tech.icon;
                    return (
                      <div
                        key={`${tech.name}-${index}`}
                        className="relative group flex flex-col items-center w-14 cursor-pointer" // slightly wider
                      >
                        <motion.div
                          className={`w-12 h-12 rounded-full border-2 border-[#FFD700] ${tech.bgColor} flex items-center justify-center text-white`} // slightly bigger container
                          whileHover={{ scale: 1.15 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <Icon size={24} /> {/* slightly bigger icon */}
                        </motion.div>
                        <motion.span className="mt-1 text-white text-[11px] font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity">
                          {tech.name}
                        </motion.span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-400 text-sm">No tech stack data available</div>
                )}
              </div>
            )}
          </div>

          {/* View Project Button */}
          <div className="flex justify-end mt-4">
            <motion.a
              href={projectLink}
              className="inline-flex items-center text-[#FFD700] font-semibold px-2 py-1 rounded cursor-pointer"
              whileHover={{ scale: 1.1, x: 4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              View Project
              <ChevronRight className="ml-1" size={20} />
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}