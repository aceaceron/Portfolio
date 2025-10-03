// CertificationCard.tsx
"use client";

import { motion } from "framer-motion";

type Props = {
  title?: string;
  org?: string;
  year?: string; // formatted like "May 2025"
  thumbnail?: string;
  pinned?: boolean;
  index: number;
  credentialId?: string;
  credentialUrl?: string;
};

export default function CertificationCard({
  title = "Course",
  org = "Issuer",
  year = "",
  thumbnail,
  pinned = false,
  index,
  credentialId,
  credentialUrl,
}: Props) {
  const handleClick = () => {
    if (credentialUrl) {
      window.open(credentialUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className={`w-full ${credentialUrl ? "cursor-pointer" : ""}`}
      onClick={handleClick}
    >
      <motion.div
        className="rounded-lg overflow-hidden bg-gray-800 border border-gray-600 text-gray-100 h-full hover:border-[#FFD700] transition-colors duration-300"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {thumbnail && (
          <div className="relative w-full aspect-video">
            <img
              src={thumbnail}
              alt={title + " certificate"}
              className="w-full h-full object-contain bg-white transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/placeholder-certificate.png";
              }}
            />
            {pinned && (
              <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow-md">
                Pinned
              </span>
            )}
          </div>
        )}

        <div className="p-3 flex flex-col h-full justify-between">
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>

            {/* Organization & Date */}
            <p className="text-sm text-gray-300 mt-1">
              {org} • {year}
            </p>

            {/* Credential ID */}
            {credentialId && (
              <div className="mt-2">
                <p className="text-xs text-gray-400">Credential ID:</p>
                <p className="text-sm text-[#FFD700] font-mono break-all">
                  {credentialId}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
