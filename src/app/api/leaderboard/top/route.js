import { NextResponse } from 'next/server';
import Leaderboard from '@/core/services/leaderboard';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get('limit') || '3', 10);
    
    const topUsers = await Leaderboard.getTopUsers(limit);

    return NextResponse.json(
      { 
        success: true, 
        topUsers 
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 400 }
    );
  }
}
