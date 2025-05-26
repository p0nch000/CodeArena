import { NextResponse } from 'next/server';
import { prisma } from '@/core/db/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 50;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const submissions = await prisma.submissions.findMany({
      where: { id_user: userId },
      include: {
        challenges: {
          select: {
            id_challenge: true,
            title: true,
            difficulty: true
          }
        }
      },
      orderBy: {
        submitted_at: 'desc'
      },
      take: limit
    });
    
    return NextResponse.json(
      { success: true, submissions },
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