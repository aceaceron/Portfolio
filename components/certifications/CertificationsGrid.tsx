"use client";
import React from "react";
// Assuming you have a separate CertificationCard component (like the one you defined previously)
import CertificationCard from "../home/CertificationCard"; // <-- You might need to adjust this path

// Define Props for the GRID component (the container)
interface Props {
  loading: boolean;
  certifications: any[]; // The array of all certification data
  filter: "certificate" | "badge";
}

// Define the shape of a single certification item for clarity
interface CertificationItem {
  id: string; // Add a key property if available
  title: string;
  org: string;
  date_earned: string;
  thumbnail: string;
  pinned: boolean;
  credential_id: string;
  credential_url: string;
  cert_type: "certificate" | "badge";
}

export default function CertificationsGrid({
  loading,
  certifications,
  filter,
}: Props) {
  // 1. Filter the certifications based on the current filter state
  const filteredCerts = certifications.filter(
    (cert: CertificationItem) => cert.cert_type === filter
  );

  // 2. Loading State UI
  if (loading) {
    return (
      <div className="flex justify-center py-12 text-gray-400">
        Loading {filter}s...
      </div>
    );
  }

  // 3. No Results State UI
  if (filteredCerts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No {filter}s found.
      </div>
    );
  }

  // 4. Render the Grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {filteredCerts.map((cert: CertificationItem, index) => (
        // Pass the individual card props to CertificationCard
        <CertificationCard
          key={cert.id || index}
          title={cert.title}
          org={cert.org}
          year={cert.date_earned ? new Date(cert.date_earned).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : ""}
          thumbnail={cert.thumbnail}
          pinned={cert.pinned}
          index={index}
          credentialId={cert.credential_id}
          credentialUrl={cert.credential_url}
        />
      ))}
    </div>
  );
}