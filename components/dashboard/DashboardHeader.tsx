"use client";
import { motion } from "framer-motion";
import CardAnimationWrapper, { childVariants } from "../CardAnimationWrapper";
import { LayoutDashboard } from "lucide-react";

export default function DashboardHeader() {
  return (
    <>
      <CardAnimationWrapper index={0} className="mb-2">  
        <div className="flex items-center gap-2 mb-2">
          <LayoutDashboard className="w-7 h-7 text-yellow-400" />
          <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600">
            Dashboard
          </h1>
        </div>
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
