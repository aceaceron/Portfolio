"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.client";

export default function useCertifications() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCertifications() {
      try {
        setLoading(true);
        setError(null);

        // Select * already includes `tags`; explicit columns listed for clarity
        const { data, error: fetchError } = await supabase
          .from("certifications")
          .select("*, tags");

        if (fetchError) {
          if (!cancelled) setError(`Failed to load certifications: ${fetchError.message}`);
          return;
        }

        if (!cancelled) setCertifications(data || []);
      } catch (err) {
        if (!cancelled) setError("An unexpected error occurred while loading certifications");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCertifications();
    return () => { cancelled = true; };
  }, []);

  return { certifications, loading, error };
}