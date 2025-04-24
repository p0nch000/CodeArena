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
      runtime: 100.50,
      memory: 50.25,
      examples: 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]',
      constraints: 'nums.length >= 2\n-10^9 <= nums[i] <= 10^9',
      created_by: user?.id_user || null,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
    {
      id_challenge: uuidv4(),
      title: 'Reverse Linked List',
      description: 'Reverse a singly linked list.',
      difficulty: 'Medium',
      published: true,
      runtime: 120.75,
      memory: 85.30,
      examples: 'Input: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]',
      constraints: 'The number of nodes in the list is [0, 5000]\n-5000 <= Node.val <= 5000',
      created_by: user?.id_user || null,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24),
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
