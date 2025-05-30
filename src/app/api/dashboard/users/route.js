import { NextResponse } from 'next/server';
import Dashboard from '@/core/services/dashboard';

export async function GET() {
  try {
    const usersData = await Dashboard.getTotalUsers();
    
    return NextResponse.json(
      { success: true, data: usersData },
      { status: 200 }
    );
  } catch (error) {
    console.error('API - Error fetching total users:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}