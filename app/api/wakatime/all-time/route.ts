// app/api/wakatime/all-time/route.ts
import { NextResponse } from 'next/server';
import { fetchWakaTimeAllTimeSinceToday } from '../../../../lib/wakatime.api';

export async function GET() {
  try {
    const data = await fetchWakaTimeAllTimeSinceToday();
    
    if (data.error) {
      return NextResponse.json(
        { error: data.error }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('WakaTime all-time API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch all-time WakaTime data' },
      { status: 500 }
    );
  }
}