import { NextResponse } from 'next/server';
import Auth from '@/core/services/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { mail, password } = body;

    const { token, user } = await Auth.login(mail, password);

    const response = NextResponse.json(
      { 
        success: true, 
        user 
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 400 
    });

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