import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    
    return NextResponse.json({
      user: {
        id: decoded.id_user,
        username: decoded.username,
        role: decoded.role
      }
    });
  } catch (error) {
    return NextResponse.json(
      { user: null },
      { status: 401 }
    );
  }
} 