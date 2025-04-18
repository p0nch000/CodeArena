const { v4: uuidv4 } = require('uuid');

module.exports = async function seedChallenges(prisma) {
  const user = await prisma.users.findFirst();

  const challenges = [
    {
      id_challenge: uuidv4(),
      title: 'Two Sum',
      description: 'Find two numbers that add up to a target.',
      difficulty: 'Easy',
      published: true,
      created_by: user?.id_user || null,
    },
    {
      id_challenge: uuidv4(),
      title: 'Reverse Linked List',
      description: 'Reverse a singly linked list.',
      difficulty: 'Medium',
      published: true,
      created_by: user?.id_user || null,
    },
  ];

  for (const challenge of challenges) {
    await prisma.challenges.upsert({
      where: { id_challenge: challenge.id_challenge },
      update: {},
      create: challenge,
    });
  }

  console.log('Challenges seeded');
};
