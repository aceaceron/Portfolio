import * as React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

type ProjectLinksProps = {
  github?: string;
  liveDemo?: string;
  itemVariants: any;
};

export default function ProjectLinks({
  github,
  liveDemo,
  itemVariants,
}: ProjectLinksProps) {
  if (!github && !liveDemo) return null;

  return (
    <motion.div variants={itemVariants} className="flex gap-4 mt-6">
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 flex items-center gap-2 bg-gray-900 rounded border border-white hover:bg-gray-700 transition"
        >
          <Github size={18} /> Source Code
        </a>
      )}
      {liveDemo && (
        <a
          href={liveDemo}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 flex items-center gap-2 bg-[#FFD700] text-black rounded hover:bg-yellow-500 transition"
        >
          <ExternalLink size={18} /> Live Demo
        </a>
      )}
    </motion.div>
  );
}