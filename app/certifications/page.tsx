"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase.client";
import CertificationsHeader from "../../components/certifications/CertificationsHeader";
import CertificationsToggle from "../../components/certifications/CertificationsToggle";
import CertificationsGrid from "../../components/certifications/CertificationsGrid";

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"certificate" | "badge">("certificate");

  useEffect(() => {
    async function fetchCertifications() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("certifications")
          .select("*")

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

  return (
    <div className="md:ml-64 px-8">
      <CertificationsHeader loading={loading} />
      <CertificationsToggle loading={loading} filter={filter} setFilter={setFilter} />
      {error && (
        <div className="mb-6 p-4 bg-red-900 border border-red-600 rounded text-red-200">
          <p>{error}</p>
        </div>
      )}
      <CertificationsGrid loading={loading} certifications={certifications} filter={filter} />
    </div>
  );
}
