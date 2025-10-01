"use client";
import { useEffect, useState } from "react";
// Adjusted import paths to resolve the 'Could not resolve' error
import DashboardHeader from "../../components/dashboard/DashboardHeader"; 
import GitHubSection from "../../components/dashboard/GithubSection";
import WakaTimeSection from "../../components/dashboard/WakaTimeSection";
import UmamiSection from "../../components/dashboard/UmamiSection";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function getLastSevenDayRange() {
  const today = new Date();
  
  // End date is yesterday
  const endDate = new Date(today);
  endDate.setDate(today.getDate() - 1);
  
  // Start date is 6 days before the end date
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 6);

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export default function LiveDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [github, setGithub] = useState<any>(null);
  const [waka, setWaka] = useState<any>(null);
  const [umami, setUmami] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [yearLoading, setYearLoading] = useState(false);
  const [wakaTimeRange, setWakaTimeRange] = useState("");
  const startYear = 2023;

  // Compute unique years from github repositories and startYear
  const uniqueYears: number[] = [
    startYear,
    ...(github?.repositories || []).map((r: { createdAt: string }) =>
      new Date(r.createdAt).getFullYear()
    ),
  ]
    .filter((year: number) => year >= startYear)
    .filter((year: number, idx: number, arr: number[]) => arr.indexOf(year) === idx)
    .sort((a: number, b: number) => b - a);

  // Fetch initial data on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [ghRes, wkRes, umRes] = await Promise.all([
          fetch("/api/github").then((r) => (r.ok ? r.json() : null)),
          fetch("/api/wakatime").then((r) => (r.ok ? r.json() : null)),
          fetch("/api/umami").then((r) => (r.ok ? r.json() : null)),
        ]);
        setGithub(ghRes);
        setWaka(wkRes);
        setUmami(umRes);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Fetch GitHub data for selected year when it changes (and not loading)
  useEffect(() => {
    if (loading) return;
    async function fetchGithubYear() {
      setYearLoading(true);
      try {
        const res = await fetch(`/api/github?year=${selectedYear}`);
        const data = await res.json();
        setGithub((prev: any) => ({ ...prev, ...data }));
      } finally {
        setYearLoading(false);
      }
    }
    fetchGithubYear();
  }, [selectedYear, loading]);

  // Set WakaTime range on mount
  useEffect(() => {
    setWakaTimeRange(getLastSevenDayRange());
  }, []);

  return (
    <div className="md:ml-64 px-8">
      <div>
        <DashboardHeader />
      </div>

      {/* 1. Umami Section (Moved to the top) */}
      <div className="pb-6">
        <UmamiSection umami={umami} loading={loading} />
      </div>

      {/* 2. GitHub Section */}
      <div className="pb-6">
        <GitHubSection
          github={github}
          loading={loading}
          yearLoading={yearLoading}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          uniqueYears={uniqueYears}
        />
      </div>

      {/* 3. WakaTime Section */}
      <div>
        <WakaTimeSection waka={waka} loading={loading} wakaTimeRange={wakaTimeRange} />
      </div>
    </div>
  );
}
