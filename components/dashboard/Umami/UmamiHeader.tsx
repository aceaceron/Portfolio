"use client";

import { motion } from "framer-motion";
import { BarChart } from "lucide-react";
import CardAnimationWrapper, { childVariants } from "../../CardAnimationWrapper";

export default function UmamiHeader() {
  return (
    <>
      <CardAnimationWrapper index={18} className="flex items-center gap-2 mb-1">
        <BarChart className="text-yellow-400 w-5 h-5" />
        <motion.h2 variants={childVariants} className="text-xl font-semibold">
          Umami
        </motion.h2>
      </CardAnimationWrapper>

      <CardAnimationWrapper index={19}>
        <motion.p variants={childVariants} className="text-gray-400 mb-4">
          Analytics to see pageviews, visitors of my website portfolio.
        </motion.p>
      </CardAnimationWrapper>

      <CardAnimationWrapper index={19}>
        <motion.p variants={childVariants} className="text-yellow-400 text-sm mb-2">
          christianluisaceron.com
        </motion.p>
      </CardAnimationWrapper>
    </>
  );
}
