import { NextResponse } from 'next/server';
import Leaderboard from '@/core/services/leaderboard';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const challengesOrder = searchParams.get('challengesOrder');
    const pointsOrder = searchParams.get('pointsOrder');
    const rankFilter = searchParams.get('rankFilter') || 'all';
    const searchQuery = searchParams.get('searchQuery') || '';
    // Eliminar parámetros de paginación

    let sortBy = null;

    if (pointsOrder) {
      sortBy = `points_${pointsOrder}`;
    } else if (challengesOrder) {
      sortBy = `challenges_${challengesOrder}`;
    }

    const leaderboardData = await Leaderboard.getLeaderboard({
      sortBy,
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
    console.error('API Error - Leaderboard filtered:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}