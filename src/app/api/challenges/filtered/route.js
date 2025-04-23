import { NextResponse } from 'next/server';
import Challenge from '@/core/services/challenge';

export async function GET(request) {
  try {
    // Get query parameters from the URL
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty') || 'all';
    
    const filteredChallenges = await Challenge.getChallengeFiltered(difficulty);

    console.log("Filtered challenges:", filteredChallenges);
    
    return NextResponse.json(
      { 
        success: true, 
        filteredChallenges 
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