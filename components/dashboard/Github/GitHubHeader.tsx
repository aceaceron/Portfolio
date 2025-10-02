"use client";

import { motion } from "framer-motion";
import { Github } from "lucide-react";
import CardAnimationWrapper, { childVariants } from "../../CardAnimationWrapper";

export default function GitHubHeader() {
  return (
    <>
      <CardAnimationWrapper index={3} className="flex items-center gap-3 mb-1">
        <Github className="text-yellow-400 w-5 h-5" />
        <motion.h2 variants={childVariants} className="text-xl font-semibold">
          GitHub
        </motion.h2>
      </CardAnimationWrapper>

      <CardAnimationWrapper index={4}>
        <motion.p variants={childVariants} className="text-gray-400 mb-2">
          Track contributions, repositories, and activity on GitHub.
        </motion.p>
      </CardAnimationWrapper>
    </>
  );
}
