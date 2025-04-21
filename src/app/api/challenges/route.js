import { NextResponse } from 'next/server';
import Challenge from '@/core/services/challenge';

export async function GET() {
  try {
    const activeChallenges = await Challenge.getActiveChallenges();
    const response = NextResponse.json(
      { 
        success: true, 
        activeChallenges 
      },
      { status: 200 }
    );
    return response;
    
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