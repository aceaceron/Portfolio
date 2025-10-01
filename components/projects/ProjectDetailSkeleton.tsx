import * as React from "react";
import { motion } from "framer-motion";

export default function ProjectDetailSkeleton() {
  return (
    <div className="md:ml-64 px-6 pb-6 pt-0 flex flex-col gap-6 min-h-96">
      {/* Back button skeleton */}
      <motion.div
        className="h-8 w-40 bg-gray-800 rounded"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      />
      {/* Category skeleton */}
      <motion.div
        className="h-5 w-28 bg-gray-700 rounded mt-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.2, delay: 0.1 }}
      />
      {/* Title + Year skeleton */}
      <motion.div
        className="h-10 w-3/4 bg-gray-600 rounded mt-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
      />
      {/* Brief skeleton */}
      <motion.div
        className="h-4 w-2/3 bg-gray-700 rounded mt-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }}
      />
      {/* Status badge skeleton */}
      <motion.div
        className="h-6 w-32 bg-gray-500 rounded-full mt-3"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
      />
      {/* Tags skeleton */}
      <motion.div className="flex gap-2 mt-3 flex-wrap">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-6 w-20 bg-gray-700 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: 0.5 + i * 0.1,
            }}
          />
        ))}
      </motion.div>
      {/* Tech stack title skeleton */}
      <motion.div
        className="h-6 w-32 bg-gray-600 rounded mt-6"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.2, delay: 0.6 }}
      />
      {/* Tech stack icons skeleton */}
      <motion.div className="flex gap-3 flex-wrap mt-2">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-11 h-11 bg-gray-700 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: 0.7 + i * 0.1,
            }}
          />
        ))}
      </motion.div>
      {/* Source & Live Demo buttons skeleton */}
      <motion.div className="flex gap-4 mt-6">
        <motion.div
          className="h-10 w-32 bg-gray-700 rounded"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.8 }}
        />
        <motion.div
          className="h-10 w-32 bg-gray-500 rounded"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.9 }}
        />
      </motion.div>
      {/* Introduction / Objectives skeleton */}
      <motion.div className="flex flex-col gap-3 mt-8">
        <motion.div
          className="h-6 w-40 bg-gray-600 rounded"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 1.0 }}
        />
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-3 w-full bg-gray-700 rounded"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: 1.1 + i * 0.1,
            }}
          />
        ))}
      </motion.div>
      {/* Gallery skeleton */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            className="w-full aspect-video bg-gray-700 rounded-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: 1.3 + i * 0.1,
            }}
          />
        ))}
      </motion.div>
      {/* Divider skeleton */}
      <motion.div
        className="w-full h-1 bg-[#FFD700]/40 rounded my-12"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.2, delay: 1.6 }}
      />
      {/* Other projects section skeleton */}
      <motion.div className="flex flex-col gap-4">
        <motion.div
          className="h-8 w-64 bg-gray-600 rounded"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 1.7 }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="h-40 bg-gray-800 rounded-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                delay: 1.8 + i * 0.1,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}