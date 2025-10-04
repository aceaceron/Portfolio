"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.client";

export default function useCertifications() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCertifications() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("certifications")
          .select("*")

        if (fetchError) {
          setError(`Failed to load certifications: ${fetchError.message}`);
          return;
        }

        setCertifications(data || []);
      } catch (err) {
        setError("An unexpected error occurred while loading certifications");
      } finally {
        setLoading(false);
      }
    }
    fetchCertifications();
  }, []);

  return { certifications, loading, error };
}
