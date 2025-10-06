"use client";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

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
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-7 h-7 text-yellow-400" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600">
              Certifications
            </h1>
          </div>
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
