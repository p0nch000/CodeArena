import { prisma } from '@/core/db/prisma';

class Dashboard {
  async getTotalChallenges() {
    try {
      // Get total challenges count
      const totalChallenges = await prisma.challenges.count();
      
      // Get monthly growth data
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      
      const previousMonthChallenges = await prisma.challenges.count({
        where: {
          created_at: {
            lt: lastMonthDate
          }
        }
      });
      
      // Calculate growth percentage
      const challengesGrowth = previousMonthChallenges > 0 
        ? (((totalChallenges - previousMonthChallenges) / previousMonthChallenges) * 100).toFixed(0)
        : 0;
        
      return {
        totalCount: totalChallenges,
        growth: parseInt(challengesGrowth)
      };
    } catch (error) {
      console.error("Error fetching total challenges:", error);
      throw error;
    }
  }

  async getTotalUsers() {
    try {
      // Get registered users count
      const registeredUsers = await prisma.users.count();
      
      // Get monthly growth data
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      
      const previousMonthUsers = await prisma.users.count({
        where: {
          created_at: {
            lt: lastMonthDate
          }
        }
      });
      
      // Calculate growth percentage
      const usersGrowth = previousMonthUsers > 0
        ? (((registeredUsers - previousMonthUsers) / previousMonthUsers) * 100).toFixed(0)
        : 0;
        
      return {
        totalCount: registeredUsers,
        growth: parseInt(usersGrowth)
      };
    } catch (error) {
      console.error("Error fetching total users:", error);
      throw error;
    }
  }

  async getTotalSubmissions() {
    try {
      // Get total submissions count
      const totalSubmissions = await prisma.submissions.count();
      
      // Get monthly growth data
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      
      const previousMonthSubmissions = await prisma.submissions.count({
        where: {
          submitted_at: {
            lt: lastMonthDate
          }
        }
      });
      
      // Calculate growth percentage
      const submissionsGrowth = previousMonthSubmissions > 0
        ? (((totalSubmissions - previousMonthSubmissions) / previousMonthSubmissions) * 100).toFixed(0)
        : 0;
        
      return {
        totalCount: totalSubmissions,
        growth: parseInt(submissionsGrowth)
      };
    } catch (error) {
      console.error("Error fetching total submissions:", error);
      throw error;
    }
  }

  async getLanguageDistribution() {
    try {
      // Define the exact language names from constants that we want to show
      const allowedLanguages = [
        // JavaScript variants
        'JavaScript (Node.js 12.14.0)',
        'JavaScript (Node.js 18.15.0)', 
        'JavaScript (Node.js 20.17.0)',
        'JavaScript (Node.js 22.08.0)',
        // Python variants
        'Python (3.8.1)',
        'Python (3.11.2)',
        'Python (3.12.5)',
        // C++ variants
        'C++ (GCC 9.2.0)',
        'C++ (GCC 14.1.0)'
      ];
      
      // Get total submissions count for allowed languages only
      const totalSubmissions = await prisma.submissions.count({
        where: {
          programming_language: {
            in: allowedLanguages
          }
        }
      });
      
      // If there are no submissions, return empty data
      if (totalSubmissions === 0) {
        return [];
      }
      
      // Get counts by language for allowed languages only
      const languageCounts = await prisma.submissions.groupBy({
        by: ['programming_language'],
        _count: {
          programming_language: true
        },
        where: {
          programming_language: {
            in: allowedLanguages
          }
        }
      });
      
      // Helper function to normalize language names for display
      const normalizeLanguageName = (fullName) => {
        if (fullName.startsWith('JavaScript')) return 'JavaScript';
        if (fullName.startsWith('Python')) return 'Python';
        if (fullName.startsWith('C++')) return 'C++';
        return fullName;
      };
      
      // Group by normalized language name and sum counts
      const groupedLanguages = {};
      languageCounts.forEach(lang => {
        const normalizedName = normalizeLanguageName(lang.programming_language);
        const count = lang._count.programming_language;
        
        if (groupedLanguages[normalizedName]) {
          groupedLanguages[normalizedName] += count;
        } else {
          groupedLanguages[normalizedName] = count;
        }
      });
      
      // Calculate percentages and format data
      const languageDistribution = Object.entries(groupedLanguages).map(([name, count]) => {
        const percentage = Math.round((count / totalSubmissions) * 100);
        
        return {
          label: name,
          value: percentage,
          count
        };
      });
      
      // Sort by percentage (highest first)
      languageDistribution.sort((a, b) => b.value - a.value);
      
      return languageDistribution;
      
    } catch (error) {
      console.error("Error fetching language distribution:", error);
      throw error;
    }
  }

// Add this function to your existing Dashboard class
  async getSubmissionsOverTime() {
      try {
      // Get the date from 9 months ago
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 8);
      startDate.setDate(1); // Start from the 1st of the month
      startDate.setHours(0, 0, 0, 0);
      
      // Get all submissions since the start date
      const submissions = await prisma.submissions.findMany({
          where: {
          submitted_at: {
              gte: startDate
          }
          },
          select: {
          submitted_at: true
          },
          orderBy: {
          submitted_at: 'asc'
          }
      });
      
      // Generate array of the last 9 months (including current month)
      const months = [];
      const monthCounts = [];
      const currentDate = new Date();
      
      for (let i = 8; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          
          // Get month name
          const monthName = date.toLocaleString('default', { month: 'short' });
          months.push(monthName);
          
          // Get year and month for comparison
          const year = date.getFullYear();
          const month = date.getMonth();
          
          // Count submissions for this month
          const count = submissions.filter(sub => {
          const subDate = new Date(sub.submitted_at);
          return subDate.getFullYear() === year && subDate.getMonth() === month;
          }).length;
          
          monthCounts.push(count);
      }
      
      return {
          months,
          series: [
          {
              data: monthCounts,
              label: 'Submissions',
              color: '#b8383a'
          }
          ]
      };
      } catch (error) {
      console.error("Error fetching submissions over time:", error);
      throw error;
      }
}

  // Add to the Dashboard class in /src/core/services/dashboard.js
  async getSuccessRate() {
    try {
      // Get total submissions count
      const totalSubmissions = await prisma.submissions.count();
      
      // If there are no submissions, return 0
      if (totalSubmissions === 0) {
        return {
          rate: 0,
          totalSubmissions: 0,
          correctSubmissions: 0,
          growth: 0
        };
      }
      
      // Get correct submissions count
      const correctSubmissions = await prisma.submissions.count({
        where: {
          is_correct: true
        }
      });
      
      // Calculate success rate percentage
      const successRate = (correctSubmissions / totalSubmissions * 100).toFixed(1);
      
      // Get last month's data for growth calculation
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      
      const previousMonthSubmissions = await prisma.submissions.count({
        where: {
          submitted_at: {
            lt: lastMonthDate
          }
        }
      });
      
      const previousMonthCorrectSubmissions = await prisma.submissions.count({
        where: {
          submitted_at: {
            lt: lastMonthDate
          },
          is_correct: true
        }
      });
      
      // Calculate previous success rate
      const previousSuccessRate = previousMonthSubmissions > 0 
        ? (previousMonthCorrectSubmissions / previousMonthSubmissions * 100)
        : 0;
      
      // Calculate growth
      const rateGrowth = previousSuccessRate > 0
        ? (((parseFloat(successRate) - previousSuccessRate) / previousSuccessRate) * 100).toFixed(0)
        : 0;
      
      return {
        rate: parseFloat(successRate),
        totalSubmissions,
        correctSubmissions,
        growth: parseInt(rateGrowth)
      };
    } catch (error) {
      console.error("Error calculating success rate:", error);
      throw error;
    }
  }

  async getChallengeMetrics() {
    try {
      // Obtener retos con sus métricas y submissions
      const challenges = await prisma.challenges.findMany({
        select: {
          id_challenge: true,
          title: true,
          difficulty: true,
          submissions: {
            select: {
              id_submission: true,
              is_correct: true,
            }
          },
        },
        where: {
          published: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
  
      // Calcular métricas para cada reto
      const challengeMetrics = challenges.map(challenge => {
        const totalSubmissions = challenge.submissions.length;
        const correctSubmissions = challenge.submissions.filter(sub => sub.is_correct).length;
        const successRate = totalSubmissions > 0 
          ? Math.round((correctSubmissions / totalSubmissions) * 100) 
          : 0;
  
        // Puntos promedio basados en dificultad
        const avgPoints = 
          challenge.difficulty === "Easy" ? 50 :
          challenge.difficulty === "Medium" ? 100 : 150;
  
        return {
          id: challenge.id_challenge,
          name: challenge.title,
          difficulty: challenge.difficulty,
          submissions: totalSubmissions,
          successRate: successRate,
          points: avgPoints
        };
      });
  
      // Ordenar por número de submissions (descendente)
      return challengeMetrics
        .sort((a, b) => b.submissions - a.submissions)
        .slice(0, 10); // Limitar a 10 retos
    } catch (error) {
      console.error("Error fetching challenge metrics:", error);
      throw error;
    }
  }
}

const dashboardService = new Dashboard();
export default dashboardService;