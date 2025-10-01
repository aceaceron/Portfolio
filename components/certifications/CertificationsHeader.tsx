"use client";
import { motion } from "framer-motion";

interface CertificationsHeaderProps {
  loading: boolean;
}

export default function CertificationsHeader({ loading }: CertificationsHeaderProps) {
  return (
    <>
      {/* Page Title */}
      {loading ? (
        <motion.div
          className="h-10 w-48 bg-gray-700 rounded mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
      ) : (
        <motion.h1
          className="text-3xl font-bold mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Certifications
        </motion.h1>
      )}

      {/* Brief Description */}
      {loading ? (
        <motion.div
          className="h-4 w-3/4 bg-gray-600 rounded mb-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.1 }}
        />
      ) : (
        <motion.p
          className="text-gray-300 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Explore the certificates and badges I have earned, demonstrating my skills, commitment, and achievements in web development and other skills.
        </motion.p>
      )}

      {/* Gold Horizontal Rule */}
      <hr className="border-[#FFD700] mb-6" />
    </>
  );
}
