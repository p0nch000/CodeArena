const { v4: uuidv4 } = require('uuid');

module.exports = async function seedSubmissionResults(prisma) {
  const submission = await prisma.submissions.findFirst();
  const testCase = await prisma.test_cases.findFirst();

  await prisma.submission_result.create({
    data: {
      id_result: uuidv4(),
      code: 'function twoSum(nums, target) { return [0,1]; }',
      is_correct: true,
      output_result: '[0,1]',
      execution_time: 1.23,
      memory_space: 12.5,
      id_submission: submission.id_submission,
      id_test_case: testCase.id_test,
    },
  });

  console.log('Submission Results seeded');
};
