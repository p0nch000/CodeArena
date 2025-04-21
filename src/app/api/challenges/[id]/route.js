import { NextResponse } from 'next/server';
import Challenge from '@/core/services/challenge';

export async function GET({ params }) {
  try {
    const { id } = params;
    const challenge = await Challenge.getChallengeById(id);
    const response = NextResponse.json(
      { 
        success: true, 
        challenge 
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