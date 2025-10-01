import * as React from "react";
import { motion } from "framer-motion";

type ProjectDescriptionProps = {
  introduction?: string;
  objectives?: string[];
  itemVariants: any;
};

export default function ProjectDescription({
  introduction,
  objectives,
  itemVariants,
}: ProjectDescriptionProps) {
  return (
    <>
      {introduction && (
        <>
          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-semibold mt-8">Introduction</h2>
          </motion.div>
          <motion.p variants={itemVariants} className="text-gray-300 mt-2">
            {introduction}
          </motion.p>
        </>
      )}

      {objectives && objectives.length > 0 && (
        <>
          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-semibold mt-6">Objectives</h2>
          </motion.div>
          <motion.ul
            variants={itemVariants}
            className="list-disc list-inside text-gray-300 mt-2"
          >
            {objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </motion.ul>
        </>
      )}
    </>
  );
}