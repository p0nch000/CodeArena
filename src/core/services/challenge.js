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

  async getChallengeFiltered(difficultyFilter) {
    try {
      // Base where clause with published challenges that haven't expired
      const whereClause = {
        published: true,
       /* deadline: {
          gte: new Date(),
        },*/
      };
      
      // Add difficulty filter if it's not 'all' and handle case sensitivity
      if (difficultyFilter !== 'all') {
        // Usando expresión regular para hacer la búsqueda insensible a mayúsculas/minúsculas
        whereClause.difficulty = {
          mode: 'insensitive',
          equals: difficultyFilter
        };
      }

      
      const filteredChallenges = await prisma.challenges.findMany({
        where: whereClause,
      });
      
      
      return filteredChallenges;
    } catch (error) {
      console.error("Error fetching filtered challenges:", error);
      return [];
    }
  }

}

export default new Challenge();