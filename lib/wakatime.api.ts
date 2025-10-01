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

type WakaEndpoint = "stats" | "heartbeats" | "projects" | "branches" | "goals";

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
      throw new Error(`WakaTime API returned ${res.status}: ${text}`);
    }

    const json = await res.json();
    return json;
  } catch (err) {
    console.error(`Failed to fetch WakaTime ${endpoint}:`, err);
    return { error: `Failed to fetch WakaTime ${endpoint}` };
  }
}

// Default fetch function (stats)
export async function fetchWakaTime(range: WakaRange = "last_7_days") {
  return fetchFromWakaTime("stats", range);
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
