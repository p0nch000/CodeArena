import { prisma } from '@/core/db/prisma';

class Challenge {
  async getFeaturedChallenge() {    
    const featuredChallenge = await prisma.challenges.findFirst({
      where: {
        published: true,
      },
    });
    return featuredChallenge;
  }

  async getActiveChallenges() {
    try {
      const activeChallenges = await prisma.challenges.findMany({
        where: {
          published: true,
          deadline: {
            gte: new Date(),
          },
        },
        orderBy: {
          deadline: 'asc',
        }
      });
      return activeChallenges;
    } catch (error) {
      console.error("Error fetching active challenges:", error);
      return [];
    }
  }

  async getChallengeById(id) {
    const challenge = await prisma.challenges.findUnique({
      where: { id_challenge: id },
    });
    return challenge;
  }
}

export default new Challenge();