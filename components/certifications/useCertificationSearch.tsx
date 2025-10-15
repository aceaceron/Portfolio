// src/hooks/useCertificationSearch.tsx
import { useState, useMemo } from "react";

// Define the expected shape of the certification item for type safety
interface CertificationItem {
  title: string;
  cert_type: "certificate" | "badge";
  tags?: string[]; // The new property to search against
  [key: string]: any; // Allows for other properties
}

export function useCertificationSearch(certifications: CertificationItem[]) {
  // Initialize search state
  const [search, setSearch] = useState("");

  const filteredCertifications = useMemo(() => {
    if (!search) {
      return certifications;
    }

    const lowerCaseSearch = search.toLowerCase();

    return certifications.filter((cert) => {
      // 1. Search by title
      const matchesTitle = cert.title?.toLowerCase().includes(lowerCaseSearch);

      // 2. Search by tags
      const matchesTags = (cert.tags ?? []).some((tag) =>
        tag.toLowerCase().includes(lowerCaseSearch)
      );

      return matchesTitle || matchesTags;
    });
  }, [certifications, search]);

  return {
    search,
    setSearch,
    filteredCertifications,
  };
}