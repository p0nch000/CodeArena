import { prisma } from '@/core/db/prisma';

class Leaderboard {
  async getLeaderboard({
    challengesOrder = null,
    pointsOrder = null,
    rankFilter = 'all',
    searchQuery = ''
  }) {
    try {
      const whereClause = {};
      if (rankFilter !== 'all') {
        whereClause.ranks = {
          name: {
            equals: rankFilter,
            mode: 'insensitive'
          }
        };
      }
  
      if (searchQuery) {
        whereClause.username = {
          contains: searchQuery,
          mode: 'insensitive'
        };
      }
  
      const users = await prisma.users.findMany({
        where: whereClause,
        include: {
          ranks: true,
          submissions: {
            distinct: ['id_challenge'],
            select: {
              id_challenge: true,
              is_correct: true
            }
          }
        },
        orderBy: pointsOrder
          ? { points: pointsOrder === 'asc' ? 'asc' : 'desc' }
          : undefined
      });
  
      const processedUsers = users.map(user => {
        const completedChallenges = user.submissions.filter(sub => sub.is_correct).length;
        return {
          id: user.id_user,
          name: user.username,
          rank: user.ranks?.name || 'Unranked',
          rankIcon: user.ranks?.icon_url || null,
          points: user.points ?? 0,
          challenges: completedChallenges,
          avatarUrl: user.avatar_url || null
        };
      });
  
      if (challengesOrder && !pointsOrder) {
        processedUsers.sort((a, b) => {
          return challengesOrder === 'desc'
            ? b.challenges - a.challenges
            : a.challenges - b.challenges;
        });
      }
  
      return processedUsers;
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return [];
    }
  }

  async getTopUsers(limit = 3, rankFilter = 'all') {
    try {
      const whereClause = {};
      if (rankFilter !== 'all') {
        whereClause.ranks = {
          name: {
            equals: rankFilter,
            mode: 'insensitive'
          }
        };
      }

      const topUsers = await prisma.users.findMany({
        where: whereClause,
        take: limit,
        orderBy: {
          points: 'desc'
        },
        include: {
          ranks: true,
          submissions: {
            distinct: ['id_challenge'],
            where: {
              is_correct: true
            },
            select: {
              id_challenge: true
            }
          }
        }
      });

      return topUsers.map((user, index) => ({
        id: user.id_user,
        name: user.username,
        rank: user.ranks?.name || 'Unranked',
        points: user.points,
        avatarUrl: user.avatar_url || null,
        position: index + 1,
        badge: index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉',
        challenges: user.submissions.length
      }));
    } catch (error) {
      console.error("Error fetching top users:", error);
      return [];
    }
  }
}

export default new Leaderboard();