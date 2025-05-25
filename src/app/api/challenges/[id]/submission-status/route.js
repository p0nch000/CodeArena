import { NextResponse } from 'next/server';
import { prisma } from '@/core/db/prisma';

export async function GET(request, { params }) {
  try {
    const id = await params.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const existingSubmission = await prisma.submissions.findFirst({
      where: {
        id_user: userId,
        id_challenge: id
      },
      include: {
        submission_result: {
          include: {
            test_cases: true
          }
        }
      }
    });
    
    if (!existingSubmission) {
      return NextResponse.json({
        success: true,
        hasSubmitted: false,
        submission: null
      });
    }

    const totalTests = existingSubmission.submission_result.length;
    const passedTests = existingSubmission.submission_result.filter(r => r.is_correct).length;
    const avgExecutionTime = existingSubmission.submission_result.reduce((sum, r) => sum + r.execution_time, 0) / totalTests;
    const avgMemorySpace = existingSubmission.submission_result.reduce((sum, r) => sum + r.memory_space, 0) / totalTests;

    const testResults = existingSubmission.submission_result
      .map((result, index) => ({
        number: index + 1,
        passed: result.is_correct,
        input: result.test_cases.user_input,
        output: result.output_result,
        expectedOutput: result.test_cases.expected_output,
        errorMessage: result.error_message,
        executionTime: result.execution_time,
        memorySpace: result.memory_space
      }));
    
    return NextResponse.json({
      success: true,
      hasSubmitted: true,
      submission: {
        id: existingSubmission.id_submission,
        code: existingSubmission.final_code,
        language: existingSubmission.programming_language,
        isCorrect: existingSubmission.is_correct,
        status: existingSubmission.status,
        submittedAt: existingSubmission.submitted_at,
        executionTime: existingSubmission.final_execution_time,
        memorySpace: existingSubmission.final_memory_space,
        summary: {
          totalTests,
          passedTests,
          allPassed: totalTests === passedTests,
          avgExecutionTime,
          avgMemorySpace
        },
        testResults
      }
    });
    
  } catch (error) {
    console.error('API - Error checking submission status:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 