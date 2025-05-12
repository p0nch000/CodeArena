import { NextResponse } from 'next/server';
import Leaderboard from '@/core/services/leaderboard';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    console.log(searchParams.toString()); // Verifica los parámetros recibidos

    const challengesOrder = searchParams.get('challengesOrder'); // puede ser null
    const pointsOrder = searchParams.get('pointsOrder'); // puede ser null
    const rankFilter = searchParams.get('rankFilter') || 'all';
    const searchQuery = searchParams.get('searchQuery') || '';

    console.log({ challengesOrder, pointsOrder, rankFilter, searchQuery }); // Verifica los parámetros individuales

    let sortBy = null;

    if (pointsOrder) {
      sortBy = `points_${pointsOrder}`; // "points_desc" o "points_asc"
    } else if (challengesOrder) {
      sortBy = `challenges_${challengesOrder}`; // "challenges_desc" o "challenges_asc"
    }

    const leaderboardData = await Leaderboard.getLeaderboard({
      sortBy,
      rankFilter,
      searchQuery,
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
