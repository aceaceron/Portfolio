"use client";
import { motion } from "framer-motion";
import { BarChart } from "lucide-react";
import CardAnimationWrapper, { childVariants } from "../../components/CardAnimationWrapper";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardCardSkeleton from "../../components/dashboard/DashboardCardSkeleton";

interface UmamiSectionProps {
  umami: any;
  loading: boolean;
}

export default function UmamiSection({ umami, loading }: UmamiSectionProps) {
  return (
    <div>
      <CardAnimationWrapper index={17}>
        <motion.hr variants={childVariants} className="border-t-2 border-yellow-400 mb-4" />
      </CardAnimationWrapper>

      <CardAnimationWrapper index={18} className="flex items-center gap-2 mb-1">
        <BarChart className="text-yellow-400 w-5 h-5" />
        <motion.h2 variants={childVariants} className="text-xl font-semibold">
          Umami
        </motion.h2>
      </CardAnimationWrapper>

      <CardAnimationWrapper index={19}>
        <motion.p variants={childVariants} className="text-gray-400 mb-2">
          Website analytics to see pageviews, visitors, and traffic trends.
        </motion.p>
      </CardAnimationWrapper>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <DashboardCardSkeleton />
        ) : (
          <CardAnimationWrapper index={20}>
            <DashboardCard
              title="Pageviews"
              value={umami?.pageviews || 0}
              description={`Unique visitors: ${umami?.visitors || 0}`}
            />
          </CardAnimationWrapper>
        )}
      </div>
    </div>
  );
}
