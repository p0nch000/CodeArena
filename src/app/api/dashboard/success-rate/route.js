import { NextResponse } from 'next/server';
import Dashboard from '@/core/services/dashboard';

export async function GET() {
  try {
    const successRateData = await Dashboard.getSuccessRate();
    
    return NextResponse.json(
      { success: true, data: successRateData },
      { status: 200 }
    );
  } catch (error) {
    console.error('API - Error fetching success rate data:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}