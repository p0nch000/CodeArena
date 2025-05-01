import { NextResponse } from 'next/server';
import Dashboard from '@/core/services/dashboard';

export async function GET() {
  try {
    const languageData = await Dashboard.getLanguageDistribution();
    
    return NextResponse.json(
      { success: true, data: languageData },
      { status: 200 }
    );
  } catch (error) {
    console.error('API - Error fetching language distribution:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}