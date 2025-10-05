"use client";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import CertificationCard from "./CertificationCard";
import useCertifications from "../../hooks/useCertifications";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut" as const,
    },
  }),
};

export default function CertificationsSection() {
  const { certifications, loading, error } = useCertifications();
  const pinnedCertifications = certifications.filter((c) => c.pinned);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      variants={sectionVariants}
      custom={3}
      viewport={{ once: true, amount: 0.2 }}
      className="mt-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Award size={24} className="text-[#FFD700]" /> Certifications
        </h2>

        <a
          href="/certifications"
          className="px-4 py-2 bg-[#FFD700] text-black rounded hover:bg-yellow-500 transition"
        >
          View All
        </a>
      </div>
      <div>
        <p className="text-gray-300 mb-4">
          Credentials and achievements that validate my expertise and continuous learning.
        </p>
      </div>

      {error && <div className="text-red-400">{error}</div>}
      {loading && (
        <div className="text-gray-400">Loading certifications...</div>
      )}
      {!loading && !error && pinnedCertifications.length === 0 && (
        <div className="text-gray-400">No pinned certifications found.</div>
      )}
      {!loading && !error && pinnedCertifications.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pinnedCertifications.map((cert, index) => (
            <CertificationCard
              key={cert.id || cert.slug}
              title={cert.title}
              org={cert.org}
              year={cert.date_validity}
              thumbnail={cert.thumbnail}
              pinned={cert.pinned}
              index={index}
              credentialId={cert.credential_id}
              credentialUrl={cert.credential_url}
            />
          ))}
        </div>
      )}
      <hr className="mt-6 border-[#FFD700]" />
    </motion.section>
  );
}
