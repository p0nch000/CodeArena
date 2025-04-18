const { v4: uuidv4 } = require('uuid');

module.exports = async function seedTestCases(prisma) {
  const challenges = await prisma.challenges.findMany();

  for (const challenge of challenges) {
    await prisma.test_cases.create({
      data: {
        id_test: uuidv4(),
        user_input: '2 7 11 15, target=9',
        expected_output: '[0,1]',
        is_hidden: false,
        id_challenge: challenge.id_challenge,
      },
    });
  }

  console.log('Test Cases seeded');
};
