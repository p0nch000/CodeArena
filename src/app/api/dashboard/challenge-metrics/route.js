import { NextResponse } from 'next/server';
import Dashboard from '@/core/services/dashboard';

export async function GET() {
  try {
    const challengeMetricsData = await Dashboard.getChallengeMetrics();
    
    return NextResponse.json(
      { success: true, data: challengeMetricsData },
      { status: 200 }
    );
  } catch (error) {
    console.error('API - Error fetching challenge metrics data:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}