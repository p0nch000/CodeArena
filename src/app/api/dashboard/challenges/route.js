import { NextResponse } from 'next/server';
import Dashboard from '@/core/services/dashboard';

export async function GET() {
  try {
    const challengesData = await Dashboard.getTotalChallenges();
    
    return NextResponse.json(
      { success: true, data: challengesData },
      { status: 200 }
    );
  } catch (error) {
    console.error('API - Error fetching total challenges:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}