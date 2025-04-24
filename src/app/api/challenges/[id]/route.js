import { NextResponse } from 'next/server';
import Challenge from '@/core/services/challenge';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log('API - Fetching challenge with ID:', id);
    
    const challenge = await Challenge.getChallengeById(id);
    console.log('API - Challenge data retrieved:', JSON.stringify(challenge, null, 2));
    
    const response = NextResponse.json(
      { 
        success: true, 
        challenge 
      },
      { status: 200 }
    );
    return response;
    
  } catch (error) {
    console.error('API - Error in GET route:', error.message);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 400 }
    );
  }
}