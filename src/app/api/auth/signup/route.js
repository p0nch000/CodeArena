import { NextResponse } from 'next/server';
import Auth from '@/core/services/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { mail, password, username } = body;

    const user = await Auth.register({ mail, password, username });

    return NextResponse.json(
      { 
        success: true, 
        user 
      },
      { status: 201 }
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