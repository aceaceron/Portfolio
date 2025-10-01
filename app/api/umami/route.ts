import { NextResponse } from "next/server";
import { fetchUmamiStats } from "../../../lib/umami.api";

export async function GET() {
  try {
    // Fetch merged stats (pageviews, sessions, websiteStats)
    const stats = await fetchUmamiStats();

    // Return as JSON with 200 status
    return NextResponse.json(stats, { status: 200 });
  } catch (error: any) {
    console.error("Umami API error:", error?.message || error);

    // Return a clean error response
    return NextResponse.json(
      { error: "Failed to fetch Umami stats" },
      { status: 500 }
    );
  }
}
