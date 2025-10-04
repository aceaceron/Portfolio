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
  id: string;
  idx: number; // Include idx for sorting
  title: string;
  org: string;
  date_validity: string;
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

  // 2. SORT the filtered array using a custom multi-criteria function.
  const sortedCerts = filteredCerts.slice().sort((a, b) => {
    // Primary Sort: Pinned Status (TRUE comes before FALSE)
    // pinned: true is 1, pinned: false is 0. Subtracting 'a' from 'b' results in:
    // a=pinned, b=unpinned: 0 - 1 = -1 (a comes first) -> INCORRECT. We want pinned items first.
    // Use b.pinned - a.pinned to get pinned items first:
    // b=pinned (1), a=unpinned (0): 1 - 0 = 1 (b comes first) -> CORRECT.
    // b=unpinned (0), a=pinned (1): 0 - 1 = -1 (a comes first) -> CORRECT.
    if (a.pinned !== b.pinned) {
      return b.pinned ? 1 : -1; // Prioritize true (pinned) over false (unpinned)
    }

    // Secondary Sort: If pinned status is the same, sort by idx (ascending)
    return a.idx - b.idx;
  });

  // 3. Loading State UI
  if (loading) {
    return (
      <div className="flex justify-center py-12 text-gray-400">
        Loading {filter}s...
      </div>
    );
  }

  // 4. No Results State UI
  if (sortedCerts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No {filter}s found.
      </div>
    );
  }

  // 5. Render the Grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {/* Map over the newly sorted array */}
      {sortedCerts.map((cert: CertificationItem, index) => (
        <CertificationCard
          key={cert.id || index}
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
  );
}