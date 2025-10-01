import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type ProjectGalleryProps = {
  gallery: string[];
  projectTitle: string;
  itemVariants: any;
};

export default function ProjectGallery({
  gallery,
  projectTitle,
  itemVariants,
}: ProjectGalleryProps) {
  if (!gallery || gallery.length === 0) return null;

  return (
    <>
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold mt-8">Gallery</h2>
      </motion.div>
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3"
      >
        {gallery.map((img, i) => (
          <motion.div
            key={i}
            className="relative w-full aspect-video bg-gray-700 rounded-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <Image
              src={img}
              alt={`${projectTitle} screenshot ${i + 1}`}
              fill
              className="rounded-lg object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}