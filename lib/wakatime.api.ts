const WAKATIME_KEY = process.env.WAKATIME_KEY;
const WAKATIME_USERNAME = process.env.WAKATIME_USERNAME;

if (!WAKATIME_KEY) {
  console.warn("WAKATIME_KEY is not set in environment variables.");
}

type WakaRange =
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "last_6_months"
  | "last_year"
  | "all_time";

type WakaEndpoint = "stats" | "heartbeats" | "projects" | "branches" | "goals" | "all_time_since_today";

async function fetchFromWakaTime(endpoint: WakaEndpoint, range?: WakaRange, params: Record<string, any> = {}) {
  if (!WAKATIME_USERNAME || !WAKATIME_KEY) {
    console.error("WAKATIME_KEY or WAKATIME_USERNAME not set");
    return { error: "Missing WakaTime credentials" };
  }

  const basicAuth = Buffer.from(`${WAKATIME_KEY}:api_token`).toString("base64");

  // Build URL with query params
  let url = `https://wakatime.com/api/v1/users/${WAKATIME_USERNAME}/${endpoint}`;
  if (endpoint === "stats" && range) url += `/${range}`;
  
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`WakaTime API Error [${res.status}]:`, text);
      
      // Provide helpful error messages
      if (res.status === 402) {
        return { error: "This feature requires a paid WakaTime subscription" };
      }
      if (res.status === 401) {
        return { error: "Invalid WakaTime API key or authentication failed" };
      }
      
      throw new Error(`WakaTime API returned ${res.status}: ${text}`);
    }

    const json = await res.json();
    return json;
  } catch (err) {
    console.error(`Failed to fetch WakaTime ${endpoint}:`, err);
    return { error: `Failed to fetch WakaTime ${endpoint}: ${err instanceof Error ? err.message : 'Unknown error'}` };
  }
}

// Default fetch function (stats)
export async function fetchWakaTime(range: WakaRange = "last_7_days") {
  return fetchFromWakaTime("stats", range);
}

// Fetch all-time stats (from your start day)
export async function fetchWakaTimeAllTime() {
  return fetchFromWakaTime("stats", "all_time");
}

// Fetch all-time since today endpoint (alternative method)
export async function fetchWakaTimeAllTimeSinceToday() {
  if (!WAKATIME_USERNAME || !WAKATIME_KEY) {
    console.error("WAKATIME_KEY or WAKATIME_USERNAME not set");
    return { error: "Missing WakaTime credentials" };
  }

  const basicAuth = Buffer.from(WAKATIME_KEY).toString("base64");
  
  // Try multiple possible endpoints
  const possibleUrls = [
    `https://wakatime.com/api/v1/users/${WAKATIME_USERNAME}/all_time_since_today`,
    `https://wakatime.com/api/v1/users/current/all_time_since_today`,
  ];

  for (const url of possibleUrls) {
    try {
      console.log(`Trying WakaTime endpoint: ${url}`);
      const res = await fetch(url, {
        headers: {
          Authorization: `Basic ${basicAuth}`,
        },
      });

      console.log(`Response status: ${res.status}`);

      if (res.ok) {
        const json = await res.json();
        console.log('Success! Response:', json);
        return json;
      }

      const text = await res.text();
      console.log(`Failed with status ${res.status}:`, text);
    } catch (err) {
      console.error(`Error trying ${url}:`, err);
    }
  }

  // If all endpoints fail, return error
  return { error: `Failed to fetch WakaTime all_time_since_today - endpoint may not be available on your plan` };
}

// Optional: fetch heartbeats (raw activity)
export async function fetchWakaHeartbeats(params: { start?: string; end?: string; project?: string } = {}) {
  return fetchFromWakaTime("heartbeats", undefined, params);
}

// Optional: fetch projects
export async function fetchWakaProjects(range: WakaRange = "last_7_days") {
  return fetchFromWakaTime("projects", range);
}

// Optional: fetch branches
export async function fetchWakaBranches(range: WakaRange = "last_7_days") {
  return fetchFromWakaTime("branches", range);
}

// Optional: fetch goals
export async function fetchWakaGoals() {
  return fetchFromWakaTime("goals");
}

// Example usage:
async function example() {
  // Method 1: Use all_time range (may have date range limits)
  const allTimeStats = await fetchWakaTimeAllTime();
  console.log("All-time stats:", allTimeStats.data?.human_readable_total);

  // Method 2: Use all_time_since_today endpoint (RECOMMENDED - matches profile)
  const allTimeSinceToday = await fetchWakaTimeAllTimeSinceToday();
  console.log("All-time since today:", allTimeSinceToday.data?.text);
  console.log("Total seconds:", allTimeSinceToday.data?.total_seconds);
}

// Quick test function
export async function getMyTotalCodingTime() {
  const result = await fetchWakaTimeAllTimeSinceToday();
  if (result.error) {
    return result;
  }
  return {
    text: result.data?.text, // e.g., "40 hrs 49 mins"
    total_seconds: result.data?.total_seconds,
    decimal: result.data?.decimal,
    digital: result.data?.digital,
  };
}

// Safe function that tries multiple approaches
export async function fetchWakaTimeSafe(preferredRange: WakaRange = "last_7_days") {
  // First, try to get all-time stats using all_time_since_today (works with free accounts)
  if (preferredRange === "all_time") {
    const allTimeResult = await fetchWakaTimeAllTimeSinceToday();
    if (!allTimeResult.error) {
      return allTimeResult;
    }
    console.warn("all_time_since_today failed, falling back to stats/all_time");
  }

  // Try the regular stats endpoint
  const statsResult = await fetchWakaTime(preferredRange);
  
  // If it fails and it was all_time or last_year, fall back to last_7_days
  if (statsResult.error && (preferredRange === "all_time" || preferredRange === "last_year")) {
    console.warn(`${preferredRange} failed (may require paid plan), using last_7_days instead`);
    return await fetchWakaTime("last_7_days");
  }
  
  return statsResult;
}

// Alternative: Fetch summaries to calculate total (works with free accounts)
export async function fetchWakaTimeSummaries(start: string, end: string) {
  if (!WAKATIME_USERNAME || !WAKATIME_KEY) {
    console.error("WAKATIME_KEY or WAKATIME_USERNAME not set");
    return { error: "Missing WakaTime credentials" };
  }

  const basicAuth = Buffer.from(WAKATIME_KEY).toString("base64");
  const url = `https://wakatime.com/api/v1/users/${WAKATIME_USERNAME}/summaries?start=${start}&end=${end}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`WakaTime summaries API Error [${res.status}]:`, text);
      throw new Error(`WakaTime API returned ${res.status}: ${text}`);
    }

    const json = await res.json();
    
    // Calculate total seconds from all days
    const totalSeconds = json.data?.reduce((acc: number, day: any) => {
      return acc + (day.grand_total?.total_seconds || 0);
    }, 0) || 0;
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    return {
      data: {
        total_seconds: totalSeconds,
        text: `${hours} hrs ${minutes} mins`,
        decimal: (totalSeconds / 3600).toFixed(2),
        digital: `${hours}:${minutes.toString().padStart(2, '0')}`,
        summaries: json.data,
      }
    };
  } catch (err) {
    console.error(`Failed to fetch WakaTime summaries:`, err);
    return { error: `Failed to fetch WakaTime summaries: ${err instanceof Error ? err.message : 'Unknown error'}` };
  }
}

// Get all-time by fetching from account creation date to today
export async function fetchWakaTimeAllTimeViaSummaries() {
  // WakaTime free accounts can access up to 2 weeks of data via summaries
  // For true all-time, you need the paid plan or the all_time_since_today endpoint
  const today = new Date().toISOString().split('T')[0];
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  console.log(`Fetching summaries from ${twoWeeksAgo} to ${today}`);
  return fetchWakaTimeSummaries(twoWeeksAgo, today);
}