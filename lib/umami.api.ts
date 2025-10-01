// lib/umami.api.ts
interface LoginResponse {
  token: string;
}

async function fetchUmamiToken(username: string, password: string): Promise<string> {
  const res = await fetch(`${process.env.UMAMI_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Umami login failed:", text);
    throw new Error("Failed to login to Umami");
  }
  const body: LoginResponse = await res.json();
  return body.token;
}

export async function fetchUmamiStats() {
  const now = Date.now();
  const oneYearAgo = now - 12 * 30 * 24 * 60 * 60 * 1000; // ~12 months
  const tomorrow = now + 24 * 60 * 60 * 1000; // tomorrow
  const token = await fetchUmamiToken(
    process.env.UMAMI_ADMIN_USER!,
    process.env.UMAMI_ADMIN_PASSWORD!
  );
  const websiteId = process.env.UMAMI_SITE_ID;

  async function fetchMetric(endpoint: string) {
    const url = `${process.env.UMAMI_URL}/api/websites/${websiteId}${endpoint}?startAt=${oneYearAgo}&endAt=${tomorrow}&unit=month&timezone=Asia/Jakarta`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      console.error(`Failed to fetch ${endpoint}:`, await res.text());
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data.map((d: any) => ({ x: d.x, y: d.y })) : [];
  }

  async function fetchTotals() {
    const url = `${process.env.UMAMI_URL}/api/websites/${websiteId}/stats?startAt=${oneYearAgo}&endAt=${tomorrow}&type=stats`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      console.error("Failed to fetch totals:", await res.text());
      return {};
    }
    const data = await res.json();
    
    // Calculate average visit duration
    const totalTime = data.totaltime?.value ?? 0;
    const visits = data.visits?.value ?? 0;
    const avgDuration = visits > 0 ? Math.round(totalTime / visits) : 0;
    
    return {
      pageviews: data.pageviews ?? { value: 0 },
      visitors: data.visitors ?? { value: 0 },
      visits: data.visits ?? { value: 0 },
      totaltime: data.totaltime ?? { value: 0 },
      bounces: data.bounces ?? { value: 0 },
      avgDuration: { value: avgDuration }, // in seconds
    };
  }

  async function fetchCountries() {
    const url = `${process.env.UMAMI_URL}/api/websites/${websiteId}/metrics?startAt=${oneYearAgo}&endAt=${tomorrow}&type=country`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      console.error("Failed to fetch countries:", await res.text());
      return { value: 0, countries: [] };
    }
    const data = await res.json();
    
    if (Array.isArray(data)) {
      const countries = data.map((country: any) => ({
        name: country.x,
        count: country.y || 0
      }));
      return { value: countries.length, countries };
    }
    
    return { value: 0, countries: [] };
  }

  async function fetchEvents() {
    const url = `${process.env.UMAMI_URL}/api/websites/${websiteId}/metrics?startAt=${oneYearAgo}&endAt=${tomorrow}&type=event`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      console.error("Failed to fetch events:", await res.text());
      return { value: 0, events: [] };
    }
    const data = await res.json();
    
    // The metrics endpoint returns an array of events with their counts
    if (Array.isArray(data)) {
      const events = data.map((event: any) => ({
        name: event.x,
        count: event.y || 0
      }));
      const totalEvents = events.reduce((sum: number, event: any) => sum + event.count, 0);
      return { value: totalEvents, events };
    }
    
    return { value: 0, events: [] };
  }

  const [pageviews, sessions, totals, countries, events] = await Promise.all([
    fetchMetric("/pageviews"),
    fetchMetric("/sessions/stats"),
    fetchTotals(),
    fetchCountries(),
    fetchEvents(),
  ]);

  return {
    pageviews,
    sessions,
    websiteStats: {
      ...totals,
      countries: {
        value: countries.value,
        breakdown: countries.countries
      },
      events: {
        value: events.value,
        breakdown: events.events
      },
    },
  };
}