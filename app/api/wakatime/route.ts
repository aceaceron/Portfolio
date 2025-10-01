import { NextResponse } from "next/server";
// Assuming fetchWakaTime is exported from this path
import { fetchWakaTime } from "../../../lib/wakatime.api";

export async function GET() {
  try {
    // This single call now fetches both summary and daily data
    const data = await fetchWakaTime("last_7_days");
    
    if (data.error) {
      console.error("WakaTime API returned error:", data.error);
      return NextResponse.json(
        { error: data.error, data: null },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (err) {
    console.error("WakaTime API route error:", err);
    return NextResponse.json(
      { error: "Failed to fetch WakaTime stats", data: null },
      { status: 500 }
    );
  }
}