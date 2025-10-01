import * as React from "react";
import { motion } from "framer-motion";

type ProjectTagsProps = {
  tags: string[];
  onTagClick: (tag: string) => void;
  itemVariants: any;
};

export default function ProjectTags({
  tags,
  onTagClick,
  itemVariants,
}: ProjectTagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <>
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold mt-6">Tags</h2>
      </motion.div>
      <motion.div
        variants={itemVariants}
        className="flex gap-2 flex-wrap mt-2"
      >
        {tags.map((tag) => (
          <span
            key={tag}
            onClick={() => onTagClick(tag)}
            className="px-3 py-1 text-sm border border-white rounded-full text-white 
                      hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </>
  );
}