// app/api/wakatime/route.ts 
import { NextResponse } from 'next/server';
import { fetchWakaTimeSafe, fetchWakaTimeAllTimeSinceToday } from '../../../lib/wakatime.api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'last_7_days';
    
    // Use the safe wrapper that handles errors gracefully
    const data = await fetchWakaTimeSafe(range as any);
    
    if (data.error) {
      return NextResponse.json(
        { error: data.error }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('WakaTime API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch WakaTime data' },
      { status: 500 }
    );
  }
}