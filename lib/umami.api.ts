// lib/umami.api.js

const UMAMI_KEY = process.env.UMAMI_KEY;
const UMAMI_SITE_ID = process.env.UMAMI_SITE_ID;

export async function fetchUmamiStats() {
  const UMAMI_URL = process.env.UMAMI_URL; // Fetch your Umami instance URL from env
  
  const res = await fetch(`${UMAMI_URL}/api/websites/${UMAMI_SITE_ID}/stats`, {
    headers: {
      Authorization: `Bearer ${UMAMI_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Umami API responded with status ${res.status}`);
  }
  
  return await res.json();
}