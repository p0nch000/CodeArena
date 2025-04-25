import { NextResponse } from 'next/server';
import Leaderboard from '@/core/services/leaderboard';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const challengesOrder = searchParams.get('challengesOrder') || 'desc';
    const pointsOrder = searchParams.get('pointsOrder') || 'desc';
    const rankFilter = searchParams.get('rankFilter') || 'all';
    const searchQuery = searchParams.get('searchQuery') || '';
    
    const leaderboardData = await Leaderboard.getLeaderboard({
      challengesOrder,
      pointsOrder,
      rankFilter,
      searchQuery
    });

    return NextResponse.json(
      { 
        success: true, 
        leaderboardData 
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
