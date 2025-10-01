import * as React from "react";
import { motion } from "framer-motion";
import BackButton from "./BackButton";

type ProjectHeaderProps = {
  title: string;
  year?: string;
  category?: string;
  brief?: string;
  status?: string;
  onCategoryClick: (category: string, e: React.MouseEvent) => void;
  onStatusClick: (status: string, e: React.MouseEvent) => void;
  itemVariants: any;
};

export default function ProjectHeader({
  title,
  year,
  category,
  brief,
  status,
  onCategoryClick,
  onStatusClick,
  itemVariants,
}: ProjectHeaderProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Live Demo Available":
        return "bg-green-500 text-white hover:bg-green-600";
      case "In Development":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "Archived":
        return "bg-gray-500 text-white hover:bg-gray-600";
      case "Completed":
        return "bg-blue-500 text-white hover:bg-blue-600";
      default:
        return "bg-gray-600 text-white hover:bg-gray-700";
    }
  };

  return (
    <>
      <motion.div variants={itemVariants}>
        <BackButton href="/projects" label="Back to Projects" />
      </motion.div>

      {category && (
        <motion.span
          variants={itemVariants}
          onClick={(e) => onCategoryClick(category, e)}
          className="category-badge text-gray-400 text-sm cursor-pointer hover:text-[#FFD700] transition-colors mt-4 block"
        >
          {category}
        </motion.span>
      )}

      <motion.h1
        variants={itemVariants}
        className="text-3xl font-bold mt-1 text-gray-100"
      >
        {title}
        {year && (
          <span className="ml-2 text-gray-400 text-lg whitespace-nowrap">
            • {year}
          </span>
        )}
      </motion.h1>

      {brief && (
        <motion.p variants={itemVariants} className="text-gray-400 mt-2">
          {brief}
        </motion.p>
      )}

      {status && (
        <motion.span
          variants={itemVariants}
          onClick={(e) => onStatusClick(status, e)}
          className={`status-badge mt-3 inline-block text-xs px-3 py-1 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-105 ${getStatusStyles(
            status
          )}`}
        >
          {status}
        </motion.span>
      )}
    </>
  );
}