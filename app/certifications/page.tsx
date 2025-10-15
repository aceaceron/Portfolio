"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { supabase } from "../../lib/supabase.client";
import CertificationsHeader from "../../components/certifications/CertificationsHeader";
import CertificationsToggle from "../../components/certifications/CertificationsToggle";
import CertificationsGrid from "../../components/certifications/CertificationsGrid";
import { useCertificationSearch } from "../../components/certifications/useCertificationSearch"; 


export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"certificate" | "badge">("certificate");

  const { search, setSearch, filteredCertifications } = useCertificationSearch(certifications);

  useEffect(() => {
    async function fetchCertifications() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("certifications")
          .select("*, tags") 
          
        if (fetchError) {
          console.error("Error fetching certifications:", fetchError);
          setError(fetchError.message);
          return;
        }

        setCertifications(data || []);
      } catch (err) {
        console.error("Unexpected error fetching certifications:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchCertifications();
  }, []);

  const handleTagClick = (tag: string) => {
    setSearch(tag);
  };

  const searchBorderStyle = search
    ? "border-2 border-[#FFD700]"
    : "border border-gray-600";

  return (
    <div className="md:ml-64 px-8">
      <CertificationsHeader loading={loading} />
      <CertificationsToggle loading={loading} filter={filter} setFilter={setFilter} />
      
      <div className="mb-6 w-full">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-gray-400 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search certifications..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-10 py-2 rounded-lg bg-gray-900 text-white focus:outline-none focus:border-[#FFD700] transition-all ${searchBorderStyle}`}
          />
          <AnimatePresence>
            {search && (
              <motion.button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 flex items-center justify-center text-gray-400 hover:text-white"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* End Search Bar Implementation */}

      {error && (
        <div className="mb-6 p-4 bg-red-900 border border-red-600 rounded text-red-200">
          <p>{error}</p>
        </div>
      )}
      
      <CertificationsGrid 
        loading={loading} 
        certifications={filteredCertifications}
        filter={filter} 
        onTagClick={handleTagClick}
      />
    </div>
  );
}