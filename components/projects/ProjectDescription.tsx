import * as React from "react";
import { motion } from "framer-motion";
import { FaInfoCircle, FaBullseye, FaLayerGroup, FaLaptopCode, FaTools , FaCheckCircle  } from "react-icons/fa"; // React Icons

// Helper function to capitalize first letter
const capitalizeFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

type FeaturesType = Record<string, string[]> | string[];

type ProjectDescriptionProps = {
  introduction?: string;
  objectives?: string[];
  features?: FeaturesType;
  challenges?: string[];
  results_benefits?: string;
  itemVariants: any;
  tech_stack_description?: Record<string, string[]>;
};

export default function ProjectDescription({
  introduction,
  objectives,
  features,
  challenges,
  results_benefits,
  itemVariants,
  tech_stack_description,
}: ProjectDescriptionProps) {
  return (
    <>
      {/* Introduction */}
      {introduction && (
        <>
          <motion.div variants={itemVariants} className="flex items-center mt-8">
            <FaInfoCircle className="mr-2 w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold">Introduction</h2>
          </motion.div>
          <motion.p variants={itemVariants} className="text-gray-300 mt-2">
            {introduction}
          </motion.p>
        </>
      )}

      {/* Objectives */}
      {objectives && objectives.length > 0 && (
        <>
          <motion.div variants={itemVariants} className="flex items-center mt-6">
            <FaBullseye className="mr-2 w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold">Objectives</h2>
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

      {/* Features */}
      {features && (
        <>
          <motion.div variants={itemVariants} className="flex items-center mt-6">
            <FaLayerGroup className="mr-2 w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold">Features</h2>
          </motion.div>

          {Array.isArray(features) ? (
            <motion.ul
              variants={itemVariants}
              className="list-disc list-inside text-gray-300 mt-2"
            >
              {features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </motion.ul>
          ) : (
            Object.entries(features).map(([key, featureList]) => (
              <div key={key} className="mt-4">
                <h3 className="text-lg font-semibold text-yellow-400 mt-2 mb-1">
                  {capitalizeFirst(key.replace(/_/g, " "))}
                </h3>
                <motion.ul
                  variants={itemVariants}
                  className="list-disc list-inside text-gray-300 ml-4"
                >
                  {featureList?.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </motion.ul>
              </div>
            ))
          )}
        </>
      )}

      {/* Tech Stack */}
      {tech_stack_description && (
        <>
          <motion.div variants={itemVariants} className="flex items-center mt-6">
            <FaLaptopCode className="mr-2 w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold">Tech Stack</h2>
          </motion.div>

          {Object.entries(tech_stack_description).map(([key, techList]) => (
            <div key={key} className="mt-4">
              <h3 className="text-lg font-semibold text-yellow-400 mt-2 mb-1">
                {capitalizeFirst(key.replace(/_/g, " "))}
              </h3>
              <motion.ul
                variants={itemVariants}
                className="list-disc list-inside text-gray-300 ml-4"
              >
                {techList?.map((tech, i) => (
                  <li key={i}>{tech}</li>
                ))}
              </motion.ul>
            </div>
          ))}
        </>
      )}

      {/* Challenges */}
      {challenges && challenges.length > 0 && (
        <>
          <motion.div variants={itemVariants} className="flex items-center mt-6">
            <FaTools className="mr-2 w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold">Challenges</h2>
          </motion.div>
          <motion.ul
            variants={itemVariants}
            className="list-disc list-inside text-gray-300 mt-2"
          >
            {challenges.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </motion.ul>
        </>
      )}

      {/* Results / Benefits */}
      {results_benefits && (
        <>
          <motion.div variants={itemVariants} className="flex items-center mt-6">
            <FaCheckCircle  className="mr-2 w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-semibold">Results / Benefits</h2>
          </motion.div>
          <motion.p variants={itemVariants} className="text-gray-300 mt-2">
            {results_benefits}
          </motion.p>
        </>
      )}
    </>
  );
}
