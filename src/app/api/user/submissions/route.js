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
    
    const submissions = await User.getUserSubmissions(userId);
    const limit = searchParams.get('limit');
    const limitedSubmissions = limit ? submissions.slice(0, Number.parseInt(limit)) : submissions;
    
    return NextResponse.json(
      { 
        success: true, 
        submissions: limitedSubmissions,
        total: submissions.length
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('API - Error fetching user submissions:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 