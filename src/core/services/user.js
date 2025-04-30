import { prisma } from '@/core/db/prisma';

class User {
    async getUser(id){
        if (!id) return null;
        
        try {
            const user = await prisma.users.findUnique({
                where: { id_user: id }
            });
            return user;
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    }

    async updateUser(id, data){
        try {
            const user = await prisma.users.update({
                where: { id_user: id },
                data
            });
            return user;
        } catch (error) {
            console.error("Error updating user:", error);
            return null;
        }
    }

    async getUserSubmissions(id){
        try {
            const submissions = await prisma.submissions.findMany({
                where: { id_user: id },
                include: {
                    challenges: {
                        select: {
                            title: true,
                            difficulty: true
                        }
                    }
                },
                orderBy: {
                    submitted_at: 'desc'
                }
            });
            return submissions;
        } catch (error) {
            console.error("Error fetching user submissions:", error);
            return [];
        }
    }

    async getUserChallenges(id){
        try {
            const solvedChallenges = await prisma.submissions.findMany({
                where: { 
                    id_user: id,
                    is_correct: true
                },
                select: {
                    challenges: true
                },
                distinct: ['id_challenge']
            });
            
            return solvedChallenges.map(sub => sub.challenges);
        } catch (error) {
            console.error("Error fetching solved challenges:", error);
            return [];
        }
    }

    async getUserRank(id){
        try {
            const user = await prisma.users.findUnique({
                where: { id_user: id }
            });
            
            if (!user) return null;
            const rank = await prisma.ranks.findFirst({
                where: {
                    min_points: {
                        lte: user.points
                    }
                },
                orderBy: {
                    min_points: 'desc'
                }
            });
            
            return rank;
        } catch (error) {
            console.error("Error fetching user rank:", error);
            return null;
        }
    }
}

export default new User();