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
      console.log("Fetching active challenges");
      
      // First check if we have any challenges at all
      const allChallenges = await prisma.challenges.findMany({
        where: {
          published: true,
        },
        take: 10,
      });
      
      console.log("All published challenges:", allChallenges.length);
      
      // Then try to get only active ones
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
      
      console.log("Active challenges with deadline >= today:", activeChallenges.length);
      
      // If no active challenges found but we have published challenges, return those instead
      if (activeChallenges.length === 0 && allChallenges.length > 0) {
        console.log("No active challenges found. Returning all published challenges instead.");
        return allChallenges;
      }
      
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