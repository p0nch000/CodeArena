const { v4: uuidv4 } = require('uuid');

module.exports = async function seedAdminSubmissionResults(prisma) {
  // Find the admin user
  const adminUser = await prisma.users.findFirst({
    where: { username: 'admin' }
  });

  if (!adminUser) {
    console.log('Admin user not found, skipping admin submission results seeding');
    return;
  }

  // Get admin submissions
  const adminSubmissions = await prisma.submissions.findMany({
    where: { id_user: adminUser.id_user }
  });

  if (adminSubmissions.length === 0) {
    console.log('No admin submissions found, skipping admin submission results seeding');
    return;
  }

  let resultsCreated = 0;

  // For each admin submission, create detailed test results
  for (const submission of adminSubmissions) {
    // Get test cases for the challenge
    const testCases = await prisma.test_cases.findMany({
      where: { id_challenge: submission.id_challenge }
    });

    if (testCases.length === 0) {
      continue; // Skip if no test cases
    }

    // Create results for each test case
    for (const testCase of testCases) {
      // For accepted submissions, all tests should pass
      // For others, some tests might fail
      const isTestPassed = submission.is_correct || Math.random() < 0.3;

      // Generate execution details based on submission status
      let executionTime;
      let memorySpace;
      let errorMessage = null;
      let outputResult;

      if (isTestPassed) {
        // Successful test - reasonable performance metrics
        executionTime = Math.floor(Math.random() * 200) + 50; // 50-250ms
        memorySpace = Math.floor(Math.random() * 3000) + 2000; // 2000-5000 KB
        outputResult = "Test passed successfully with expected output";
      } else {
        // Failed test case
        executionTime = Math.floor(Math.random() * 500) + 200; // 200-700ms
        memorySpace = Math.floor(Math.random() * 5000) + 3000; // 3000-8000 KB
        
        // Different error types based on submission status
        if (submission.status === 'Wrong Answer') {
          outputResult = "Output doesn't match expected result";
          errorMessage = "Expected output doesn't match actual result";
        } else if (submission.status === 'Time Limit Exceeded') {
          outputResult = "Execution timed out";
          errorMessage = "Solution exceeded time limit";
          executionTime = Math.floor(Math.random() * 1000) + 1500; // 1500-2500ms (very slow)
        } else if (submission.status === 'Runtime Error') {
          outputResult = "Runtime error occurred";
          errorMessage = "Null pointer exception or division by zero";
        } else if (submission.status === 'Compilation Error') {
          outputResult = "Code failed to compile";
          errorMessage = "Syntax error on line 42";
        } else {
          outputResult = "Execution failed";
          errorMessage = "Unknown error occurred";
        }
      }

      // Create the submission result
      await prisma.submission_result.create({
        data: {
          id_result: uuidv4(),
          code: submission.final_code,
          is_correct: isTestPassed,
          output_result: outputResult,
          execution_time: executionTime,
          memory_space: memorySpace,
          error_message: errorMessage,
          id_test_case: testCase.id_test,
          id_submission: submission.id_submission
        }
      });

      resultsCreated++;
    }
  }

  console.log(`${resultsCreated} Admin Submission Results seeded`);
}; 