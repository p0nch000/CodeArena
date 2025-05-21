import { NextResponse } from 'next/server';
import { prisma } from '@/core/db/prisma';
import judge0Service from '@/core/services/judge0';
import { LANGUAGES } from '@/core/constants';
import { wrapCodeForJudge0 } from '@/core/utils/codeWrapper';

export async function POST(request, { params }) {
  try {
    const id = params.id;
    
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
    
    const { code, language } = body;
    
    if (!code || !language) {
      return NextResponse.json(
        { success: false, error: `Code and language are required. Received: code=${!!code}, language=${!!language}` },
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
    
    const testCases = await prisma.test_cases.findMany({
      where: {
        id_challenge: id,
        is_hidden: false
      }
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
          if (!wrappedCode) {
            throw new Error('Code wrapping failed');
          }
          
          if (!languageId) {
            throw new Error('Invalid language ID');
          }
          
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
            errorMessage: error.message
          };
        }
      })
    );
    
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const avgExecutionTime = results.reduce((sum, r) => sum + (r.executionTime || 0), 0) / totalTests;
    const avgMemorySpace = results.reduce((sum, r) => sum + (r.memorySpace || 0), 0) / totalTests;
    
    return NextResponse.json({
      success: true,
      summary: {
        totalTests,
        passedTests,
        allPassed: totalTests === passedTests,
        avgExecutionTime,
        avgMemorySpace
      },
      results
    });
    
  } catch (error) {
    console.error('API - Error in run code route:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 