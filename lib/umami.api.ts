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

  const token = await fetchUmamiToken(
    process.env.UMAMI_ADMIN_USER!,
    process.env.UMAMI_ADMIN_PASSWORD!
  );

  // Helper to fetch pageviews or sessions
  async function fetchMetric(type: "pageviews" | "sessions") {
    const url = `${process.env.UMAMI_URL}/api/websites/${process.env.UMAMI_SITE_ID}/stats?startAt=${oneYearAgo}&endAt=${now}&unit=month&type=${type}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error(`Umami fetch ${type} failed:`, txt);
      return [];
    }

    const data = await res.json();
    const key = Object.keys(data)[0];

    if (Array.isArray(data[key])) {
      return data[key].map((d: any) => ({
        x: d.x,
        y: d.y,
      }));
    }

    return [];
  }

  // Fetch total stats (summary)
  async function fetchTotals() {
    const url = `${process.env.UMAMI_URL}/api/websites/${process.env.UMAMI_SITE_ID}/stats?startAt=${oneYearAgo}&endAt=${now}&type=stats`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("Umami totals fetch failed:", txt);
      return {};
    }

    return res.json();
  }

  // Fetch events (custom events like downloads)
  async function fetchEvents() {
    try {
      const url = `${process.env.UMAMI_URL}/api/websites/${process.env.UMAMI_SITE_ID}/events?startAt=${oneYearAgo}&endAt=${now}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Umami events fetch failed:", txt);
        return [];
      }

      const data = await res.json();
      // Map to simplified format: name, value, type, timestamp
      return data.map((e: any) => ({
        name: e.name,
        value: e.value,
        type: e.type,
        timestamp: e.timestamp,
      }));
    } catch (err) {
      console.error("Error fetching events:", err);
      return [];
    }
  }

  const [pageviews, sessions, totals, events] = await Promise.all([
    fetchMetric("pageviews"),
    fetchMetric("sessions"),
    fetchTotals(),
    fetchEvents(),
  ]);

  return {
    pageviews,       // array of {x,y}
    sessions,        // array of {x,y}
    events,          // array of {name, value, type, timestamp}
    websiteStats: totals ?? {},
  };
}
