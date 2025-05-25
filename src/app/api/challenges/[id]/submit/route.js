import { NextResponse } from 'next/server';
import { prisma } from '@/core/db/prisma';
import judge0Service from '@/core/services/judge0';
import { LANGUAGES } from '@/core/constants';
import { wrapCodeForJudge0 } from '@/core/utils/codeWrapper';

function calculatePoints(difficulty, avgExecutionTime, avgMemorySpace, allPassed) {
  if (!allPassed) return 0;
  
  const basePoints = {
    'Easy': 100,
    'Medium': 200,
    'Hard': 300
  };
  
  let points = basePoints[difficulty] || 50;
  
  if (avgExecutionTime < 100) points += 20;
  else if (avgExecutionTime < 500) points += 10;
  else if (avgExecutionTime < 1000) points += 5;
  
  if (avgMemorySpace < 1024 * 1024) points += 15;
  else if (avgMemorySpace < 5 * 1024 * 1024) points += 5;
  
  return points;
}

async function updateUserRank(userId, newPoints) {
  const ranks = await prisma.ranks.findMany({
    orderBy: { min_points: 'desc' }
  });
  
  const appropriateRank = ranks.find(rank => newPoints >= rank.min_points);
  
  if (appropriateRank) {
    const currentUser = await prisma.users.findUnique({
      where: { id_user: userId },
      select: { id_rank: true }
    });
    
    if (currentUser?.id_rank !== appropriateRank.id_rank) {
      await prisma.users.update({
        where: { id_user: userId },
        data: { id_rank: appropriateRank.id_rank }
      });
    }
  }
}

async function updateChallengeMetrics(challengeId, isCorrect) {
  const existingMetrics = await prisma.challenge_metrics.findFirst({
    where: { id_challenge: challengeId }
  });

  if (existingMetrics) {
    await prisma.challenge_metrics.update({
      where: { id_metrics: existingMetrics.id_metrics },
      data: {
        total_submissions: { increment: 1 },
        correct_submissions: isCorrect ? { increment: 1 } : undefined
      }
    });
  } else {
    await prisma.challenge_metrics.create({
      data: {
        id_challenge: challengeId,
        total_submissions: 1,
        correct_submissions: isCorrect ? 1 : 0,
        avg_time_complexity: 'O(n)',
        avg_space_complexity: 'O(1)',
        likes: 0
      }
    });
  }
}

export async function POST(request, { params }) {
  try {
    const id = await params.id;
    
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('Error al parsear el body:', error);
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    const { code, language, userId } = body;
    
    if (!code || !language || !userId) {
      return NextResponse.json(
        { success: false, error: 'Code, language, and userId are required' },
        { status: 400 }
      );
    }
    
    const existingSubmission = await prisma.submissions.findFirst({
      where: {
        id_user: userId,
        id_challenge: id
      }
    });
    
    if (existingSubmission) {
      return NextResponse.json(
        { success: false, error: 'You have already submitted a solution for this challenge' },
        { status: 400 }
      );
    }
    
    const languageId = Object.values(LANGUAGES).find(
      lang => lang.name === language
    )?.id;
    
    if (!languageId) {
      return NextResponse.json(
        { success: false, error: 'Invalid language' },
        { status: 400 }
      );
    }
    
    const challenge = await prisma.challenges.findUnique({
      where: { id_challenge: id }
    });
    
    if (!challenge) {
      return NextResponse.json(
        { success: false, error: 'Challenge not found' },
        { status: 404 }
      );
    }
    
    const testCases = await prisma.test_cases.findMany({
      where: { id_challenge: id }
    });
    
    if (testCases.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No test cases found for this challenge' },
        { status: 404 }
      );
    }
    
    const wrappedCode = wrapCodeForJudge0(code, language);
    
    const results = await Promise.all(
      testCases.map(async (testCase) => {
        try {
          const result = await judge0Service.runCode({
            sourceCode: wrappedCode,
            languageId: languageId,
            stdin: testCase.user_input,
            expectedOutput: testCase.expected_output
          });
          
          const processedResult = judge0Service.processSubmissionResult(result);
          
          return {
            testCaseId: testCase.id_test,
            input: testCase.user_input,
            expectedOutput: testCase.expected_output,
            passed: processedResult.isCorrect,
            output: processedResult.output,
            executionTime: processedResult.executionTime,
            memorySpace: processedResult.memorySpace,
            errorMessage: processedResult.errorMessage
          };
        } catch (error) {
          console.error(`Error running test case ${testCase.id_test}:`, error.message);
          return {
            testCaseId: testCase.id_test,
            input: testCase.user_input,
            expectedOutput: testCase.expected_output,
            passed: false,
            errorMessage: error.message,
            executionTime: 0,
            memorySpace: 0
          };
        }
      })
    );
    
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const allPassed = totalTests === passedTests;
    const avgExecutionTime = results.reduce((sum, r) => sum + (r.executionTime || 0), 0) / totalTests;
    const avgMemorySpace = results.reduce((sum, r) => sum + (r.memorySpace || 0), 0) / totalTests;
    
    const submission = await prisma.submissions.create({
      data: {
        final_code: code,
        is_correct: allPassed,
        final_execution_time: avgExecutionTime,
        final_memory_space: avgMemorySpace,
        programming_language: language,
        status: allPassed ? 'ACCEPTED' : 'WRONG_ANSWER',
        id_user: userId,
        id_challenge: id
      }
    });
    
    await Promise.all(
      results.map(result => 
        prisma.submission_result.create({
          data: {
            code: code,
            is_correct: result.passed,
            output_result: result.output || '',
            execution_time: result.executionTime || 0,
            memory_space: result.memorySpace || 0,
            error_message: result.errorMessage || null,
            id_test_case: result.testCaseId,
            id_submission: submission.id_submission
          }
        })
      )
    );
    
    let pointsAwarded = 0;
    let newUserPoints = 0;
    
    if (allPassed) {
      pointsAwarded = calculatePoints(challenge.difficulty, avgExecutionTime, avgMemorySpace, allPassed);
      
      const updatedUser = await prisma.users.update({
        where: { id_user: userId },
        data: { 
          points: { increment: pointsAwarded },
          updated_at: new Date()
        }
      });
      
      newUserPoints = updatedUser.points;
      
      await updateUserRank(userId, newUserPoints);
    }
    
    await updateChallengeMetrics(id, allPassed);
    
    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id_submission,
        isCorrect: allPassed,
        status: submission.status,
        pointsAwarded,
        newUserPoints
      },
      summary: {
        totalTests,
        passedTests,
        allPassed,
        avgExecutionTime,
        avgMemorySpace
      },
      results: results.map(r => ({
        ...r,
        isHidden: testCases.find(tc => tc.id_test === r.testCaseId)?.is_hidden || false
      })).filter(r => !r.isHidden)
    });
    
  } catch (error) {
    console.error('API - Error in submit code route:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
