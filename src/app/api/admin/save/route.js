import { prisma } from '@/core/db/prisma';

export async function POST(req) {
  try {
    const challengeData = await req.json();
    
    // Extract all the required data from the challenge
    const { 
      title, 
      description, 
      difficulty, 
      examples,
      constraints,
      test_cases = [],
      created_by = null // Optional user ID who created the challenge
    } = challengeData;

    // Convert examples and constraints to strings for database storage
    const examplesStr = typeof examples === 'object' ? 
      JSON.stringify(examples) : String(examples);
    
    const constraintsStr = Array.isArray(constraints) ? 
      JSON.stringify(constraints) : String(constraints);

    // Create the challenge in the database
    const newChallenge = await prisma.challenges.create({
      data: {
        title,
        description,
        difficulty,
        examples: examplesStr,
        constraints: constraintsStr,
        published: true,
        created_by,
        created_at: new Date()
      },
    });

    // Also create associated challenge_metrics
    await prisma.challenge_metrics.create({
      data: {
        id_challenge: newChallenge.id_challenge,
        avg_time_complexity: "O(n)", // Default values
        avg_space_complexity: "O(n)" // Default values
      }
    });

    // Create test cases
    await createTestCases(newChallenge.id_challenge, test_cases);

    return new Response(JSON.stringify({ 
      success: true, 
      challenge: newChallenge 
    }), { status: 201 });
  } catch (error) {
    console.error("Error saving challenge:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: "Failed to save challenge to database" 
    }), { status: 500 });
  }
}

/**
 * Creates test cases in the database
 * @param {string} challengeId - The UUID of the challenge
 * @param {Array} testCases - Array of test case objects with input and output properties
 */
async function createTestCases(challengeId, testCases) {
  try {
    // Validate test cases array
    if (!Array.isArray(testCases) || testCases.length === 0) {
      console.warn("No valid test cases provided for challenge:", challengeId);
      // Create a default test case
      await prisma.test_cases.create({
        data: {
          user_input: "Default test input",
          expected_output: "Default expected output",
          is_hidden: false,
          id_challenge: challengeId
        }
      });
      return;
    }

    // Format test cases for database
    const formattedTestCases = testCases.map((testCase, index) => {
      // Check if the test case has the required properties
      if (!testCase || typeof testCase !== 'object' || 
          testCase.input === undefined || testCase.output === undefined) {
        return null;
      }

      const userInput = typeof testCase.input === 'object' ? 
        JSON.stringify(testCase.input) : String(testCase.input);
      
      const expectedOutput = typeof testCase.output === 'object' ? 
        JSON.stringify(testCase.output) : String(testCase.output);

      // Make some test cases hidden (typically, harder ones or edge cases)
      const isHidden = index >= Math.ceil(testCases.length / 2); // Make about half of the test cases hidden

      return {
        user_input: userInput,
        expected_output: expectedOutput,
        is_hidden: isHidden,
        id_challenge: challengeId
      };
    }).filter(Boolean); // Remove any null entries

    // If we have valid formatted test cases, create them in the database
    if (formattedTestCases.length > 0) {
      await prisma.test_cases.createMany({
        data: formattedTestCases
      });
    } else {
      // If no valid test cases, create a default one
      await prisma.test_cases.create({
        data: {
          user_input: "Default test input",
          expected_output: "Default expected output",
          is_hidden: false,
          id_challenge: challengeId
        }
      });
    }
  } catch (error) {
    console.error("Error creating test cases:", error);
    // Don't throw - we want the challenge creation to succeed even if test case creation fails
  }
}