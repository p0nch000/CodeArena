import { NextResponse } from 'next/server';
import User from '@/core/services/user';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const solvedChallenges = await User.getUserChallenges(userId);
    const difficulty = searchParams.get('difficulty');
    
    let filteredChallenges = solvedChallenges;
    
    if (difficulty && difficulty !== 'all') {
      filteredChallenges = solvedChallenges.filter(
        challenge => challenge.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }
    
    return NextResponse.json(
      { 
        success: true, 
        challenges: filteredChallenges,
        total: filteredChallenges.length,
        stats: {
          easy: solvedChallenges.filter(c => c.difficulty.toLowerCase() === 'easy').length,
          medium: solvedChallenges.filter(c => c.difficulty.toLowerCase() === 'medium').length,
          hard: solvedChallenges.filter(c => c.difficulty.toLowerCase() === 'hard').length,
          total: solvedChallenges.length
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('API - Error fetching user challenges:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 