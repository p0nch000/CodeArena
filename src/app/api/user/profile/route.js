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
    
    const user = await User.getUser(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const rank = await User.getUserRank(userId);
    const solvedChallenges = await User.getUserChallenges(userId);
    
    const byDifficulty = {
      easy: solvedChallenges.filter(c => c.difficulty === 'easy').length,
      medium: solvedChallenges.filter(c => c.difficulty === 'medium').length,
      hard: solvedChallenges.filter(c => c.difficulty === 'hard').length
    };
    
    const profile = {
      user: {
        id: user.id_user,
        username: user.username,
        role: user.user_role,
        points: user.points
      },
      rank: {
        name: rank?.name,
        icon: rank?.icon_url,
        points: user.points,
      },
      stats: {
        totalSolved: solvedChallenges.length,
        byDifficulty
      }
    };
    
    return NextResponse.json(
      { success: true, profile },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('API - Error fetching user profile:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 