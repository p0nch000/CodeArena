module.exports = async function updateUserRanks(prisma) {
    const ranks = await prisma.ranks.findMany();
    const sortedRanks = ranks.sort((a, b) => b.min_points - a.min_points);
  
    const getRankIdByPoints = (points) => {
      const descending = [...sortedRanks].sort((a, b) => b.min_points - a.min_points);
      const rank = descending.find(r => points >= r.min_points);
      return rank?.id_rank || null;
    };
  
    const users = await prisma.users.findMany();
  
    for (const user of users) {
      const id_rank = getRankIdByPoints(user.points);
      if (id_rank && user.id_rank !== id_rank) {
        await prisma.users.update({
          where: { id_user: user.id_user },
          data: { id_rank },
        });
        console.log(`Updated rank for user ${user.username}`);
      }
    }
  
    console.log('User ranks updated');
  };
  