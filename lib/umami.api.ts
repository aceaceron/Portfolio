// lib/umami.api.ts

interface UmamiDataPoint {
  x: string;
  y: number;
}

interface LoginResponse {
  token: string;
}

async function fetchUmamiToken(): Promise<string> {
  const res = await fetch(`${process.env.UMAMI_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: process.env.UMAMI_ADMIN_USER,
      password: process.env.UMAMI_ADMIN_PASSWORD,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Umami login failed:", await res.text());
    throw new Error("Failed to login to Umami");
  }

  const body: LoginResponse = await res.json();
  return body.token;
}

export async function fetchUmamiStats() {
  const token = await fetchUmamiToken();
  const websiteId = process.env.UMAMI_SITE_ID;
  const timezone = "Asia/Jakarta";

  // Calculate Dates: 1 Year ago to Tomorrow
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 1);
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  const startAt = startDate.getTime();
  const endAt = endDate.getTime();

  const headers = { Authorization: `Bearer ${token}` };

  // Helper to standardise response data map
  const mapData = (data: any) => {
    // Check if data is array or nested object
    const points = Array.isArray(data)
      ? data
      : (data.pageviews || data.sessions || data.visitors || data.visits || []);
    return points.map((d: any) => ({ x: d.x || d.t, y: d.y }));
  };

  // 1. Fetch Monthly Pageviews
  async function fetchMonthlyPageviews() {
    const url = `${process.env.UMAMI_URL}/api/websites/${websiteId}/pageviews?startAt=${startAt}&endAt=${endAt}&unit=month&timezone=${timezone}`;
    try {
      const res = await fetch(url, { headers, cache: "no-store" });
      if (!res.ok) return [];
      return mapData(await res.json());
    } catch (e) {
      console.error("Pageviews error:", e);
      return [];
    }
  }

  // 2. Fetch Monthly Visitors (Robust "Shotgun" Strategy)
  // Tries multiple endpoints in case the API version differs
  async function fetchMonthlyVisitors() {
    const endpoints = [
      `/visits`,    // Common for Sessions
      `/visitors`,  // Common for Unique Humans
      `/sessions`,  // Older V2
      `/stats/visits`, // Legacy
      `/stats/visitors` // Legacy
    ];

    for (const endpoint of endpoints) {
      const url = `${process.env.UMAMI_URL}/api/websites/${websiteId}${endpoint}?startAt=${startAt}&endAt=${endAt}&unit=month&timezone=${timezone}`;
      try {
        const res = await fetch(url, { headers, cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const mapped = mapData(data);
          // If we found data, return it immediately
          if (mapped.length > 0) {
            return mapped;
          }
        }
      } catch (e) {
        // Continue to next endpoint if failed
        continue;
      }
    }
    
    // If all fail, return empty
    console.warn("Could not find Visitor/Session data from any known endpoint.");
    return [];
  }

  // 3. Aggregate Stats
  async function fetchTotals() {
    const url = `${process.env.UMAMI_URL}/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`;
    try {
      const res = await fetch(url, { headers, cache: "no-store" });
      if (!res.ok) return {};
      const data = await res.json();

      const totalTime = data.totaltime?.value ?? 0;
      const visits = data.visits?.value ?? 0;
      const avgDurationSeconds = visits > 0 ? Math.round(totalTime / visits) : 0;

      function formatAvgDuration(seconds: number) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        const parts = [];
        if (hrs > 0) parts.push(`${hrs} hr${hrs > 1 ? "s" : ""}`);
        if (mins > 0) parts.push(`${mins} min${mins > 1 ? "s" : ""}`);
        if (secs > 0) parts.push(`${secs} sec${secs > 1 ? "s" : ""}`);
        return parts.join(" ") || "0 sec";
      }

      return {
        pageviews: data.pageviews ?? { value: 0 },
        visitors: data.visitors ?? { value: 0 },
        visits: data.visits ?? { value: 0 },
        totaltime: data.totaltime ?? { value: 0 },
        bounces: data.bounces ?? { value: 0 },
        avgDuration: {
          value: avgDurationSeconds,
          formatted: formatAvgDuration(avgDurationSeconds),
        },
      };
    } catch (e) {
      return {};
    }
  }

  async function fetchCountries() {
    const url = `${process.env.UMAMI_URL}/api/websites/${websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&type=country`;
    try {
      const res = await fetch(url, { headers, cache: "no-store" });
      if (!res.ok) return { value: 0, countries: [] };
      const data = await res.json();
      const countries = Array.isArray(data)
        ? data.map((c: any) => ({ name: c.x, count: c.y || 0 }))
        : [];
      return { value: countries.length, countries };
    } catch (e) {
      return { value: 0, countries: [] };
    }
  }

  async function fetchEvents() {
    const url = `${process.env.UMAMI_URL}/api/websites/${websiteId}/metrics?startAt=${startAt}&endAt=${endAt}&type=event`;
    try {
      const res = await fetch(url, { headers, cache: "no-store" });
      if (!res.ok) return { value: 0, events: [] };
      const data = await res.json();
      const events = Array.isArray(data)
        ? data.map((e: any) => ({ name: e.x, count: e.y || 0 }))
        : [];
      const total = events.reduce((s, e) => s + e.count, 0);
      return { value: total, events };
    } catch (e) {
      return { value: 0, events: [] };
    }
  }

  const [pageviews, visitors, totals, countries, events] = await Promise.all([
    fetchMonthlyPageviews(),
    fetchMonthlyVisitors(),
    fetchTotals(),
    fetchCountries(),
    fetchEvents(),
  ]);

  return {
    pageviews,
    visitors, 
    websiteStats: {
      ...totals,
      countries: {
        value: countries.value,
        breakdown: countries.countries,
      },
      events: {
        value: events.value,
        breakdown: events.events,
      },
    },
  };
}