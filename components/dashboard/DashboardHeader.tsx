"use client";
import { motion } from "framer-motion";
import CardAnimationWrapper, { childVariants } from "../CardAnimationWrapper";

export default function DashboardHeader() {
  return (
    <>
      <CardAnimationWrapper index={0} className="mb-2">
        <motion.h1 variants={childVariants} className="text-3xl font-bold">
          Dashboard
        </motion.h1>
      </CardAnimationWrapper>

      <CardAnimationWrapper index={1} className="mb-4">
        <motion.p variants={childVariants} className="text-gray-300">
          Overview of my GitHub, WakaTime, and website analytics.
        </motion.p>
      </CardAnimationWrapper>

      <CardAnimationWrapper index={2}>
        <hr className="border-[#FFD700] mb-6" />
      </CardAnimationWrapper>
    </>
  );
}
