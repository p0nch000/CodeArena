const { v4: uuidv4 } = require('uuid');

module.exports = async function seedChallengeMetrics(prisma) {
  const challenges = await prisma.challenges.findMany();

  for (const challenge of challenges) {
    const existingMetric = await prisma.challenge_metrics.findFirst({
      where: { id_challenge: challenge.id_challenge },
    });

    if (!existingMetric) {
      await prisma.challenge_metrics.create({
        data: {
          id_metrics: uuidv4(),
          id_challenge: challenge.id_challenge,
          total_submissions: 20,
          correct_submissions: 10,
          avg_time_complexity: 'O(n)',
          avg_space_complexity: 'O(1)',
          likes: 15,
        },
      });
    }
  }

  console.log('Challenge Metrics seeded');
};

