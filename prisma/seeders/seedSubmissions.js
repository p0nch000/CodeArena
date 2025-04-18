const { v4: uuidv4 } = require('uuid');

module.exports = async function seedSubmissions(prisma) {
  const user = await prisma.users.findFirst();
  const challenge = await prisma.challenges.findFirst();

  const submissionId = uuidv4();

  await prisma.submissions.create({
    data: {
      id_submission: submissionId,
      final_code: 'function twoSum(nums, target) { /* ... */ }',
      is_correct: true,
      programming_language: 'JavaScript',
      status: 'Accepted',
      id_user: user.id_user,
      id_challenge: challenge.id_challenge,
    },
  });

  console.log('Submissions seeded');
};
