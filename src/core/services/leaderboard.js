import { prisma } from '@/core/db/prisma';

class Leaderboard {
  async getLeaderboard({
    sortBy = null,
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

      const orderBy = [];
      if (sortBy) {
        if (sortBy.startsWith('points')) {
          orderBy.push({
            points: sortBy === 'points_asc' ? 'asc' : 'desc'
          });
        } 
      }

      // Paginación
      
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
        orderBy: orderBy.length ? orderBy : undefined,
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

      if (sortBy?.startsWith('challenges')) {
        processedUsers.sort((a, b) =>
          sortBy === 'challenges_desc'
            ? b.challenges - a.challenges
            : a.challenges - b.challenges
        );
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

      return topUsers.map((user, index) => {
        let badge;
        if (index === 0) {
          badge = '🥇';
        } else if (index === 1) {
          badge = '🥈';
        } else {
          badge = '🥉';
        }
        return {
          id: user.id_user,
          name: user.username,
          rank: user.ranks?.name || 'Unranked',
          points: user.points,
          avatarUrl: user.avatar_url || null,
          position: index + 1,
          badge: badge,
          challenges: user.submissions.length
        };
      });

    } catch (error) {
      console.error("Error fetching top users:", error);
      return [];
    }
  }
}

const leaderboardService = new Leaderboard();
export default leaderboardService;