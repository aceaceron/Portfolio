import { NextResponse } from "next/server";
import { fetchUmamiStats } from "../../../lib/umami.api"; // ✅ Correct import

export async function GET() {
  try {
    const data = await fetchUmamiStats(); // ✅ Correct function
    return NextResponse.json(data);
  } catch (err) {
    console.error("Umami API error:", err); // ✅ Log the error
    return NextResponse.json({ error: "Failed to fetch Umami stats" }, { status: 500 });
  }
}