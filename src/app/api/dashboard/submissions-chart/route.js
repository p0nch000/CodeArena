import { NextResponse } from 'next/server';
import Dashboard from '@/core/services/dashboard';

export async function GET() {
  try {
    const submissionsData = await Dashboard.getSubmissionsOverTime();
    
    return NextResponse.json(
      { success: true, data: submissionsData },
      { status: 200 }
    );
  } catch (error) {
    console.error('API - Error fetching submissions chart data:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}