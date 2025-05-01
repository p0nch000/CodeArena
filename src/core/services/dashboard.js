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
      // Get total submissions count
      const totalSubmissions = await prisma.submissions.count();
      
      // If there are no submissions, return empty data
      if (totalSubmissions === 0) {
        return [];
      }
      
      // Get counts by language
      const languageCounts = await prisma.submissions.groupBy({
        by: ['programming_language'],
        _count: {
          programming_language: true
        }
      });
      
      // Calculate percentages and format data
      const languageDistribution = languageCounts.map(lang => {
        const count = lang._count.programming_language;
        const percentage = Math.round((count / totalSubmissions) * 100);
        
        return {
          label: lang.programming_language,
          value: percentage,
          count
        };
      });
      
      // Sort by percentage (highest first)
      languageDistribution.sort((a, b) => b.value - a.value);
      
      // Combine small percentages into "Others" if needed
      const threshold = 5; // Languages with less than 5% go into "Others"
      const mainLanguages = languageDistribution.filter(lang => lang.value >= threshold);
      const others = languageDistribution.filter(lang => lang.value < threshold);
      
      let result = [...mainLanguages];
      
      if (others.length > 0) {
        const othersTotal = others.reduce((sum, lang) => sum + lang.value, 0);
        if (othersTotal > 0) {
          result.push({
            label: 'Others',
            value: othersTotal,
            count: others.reduce((sum, lang) => sum + lang.count, 0)
          });
        }
      }
      
      return result;
      
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
}

export default new Dashboard();