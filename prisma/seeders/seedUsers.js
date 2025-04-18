const { v4: uuidv4 } = require('uuid');

module.exports = async function seedUsers(prisma) {
  // Obtener todos los ranks
  const ranks = await prisma.ranks.findMany();

  // Función para obtener el id_rank correcto en base a los puntos
  const getRankIdByPoints = (points) => {
    const sortedRanks = [...ranks].sort((a, b) => b.min_points - a.min_points);
    const rank = sortedRanks.find(r => points >= r.min_points);
    return rank?.id_rank || null;
  };

  const users = [
    {
      id_user: uuidv4(),
      username: 'user1',
      password_hash: 'hashedpassword1',
      mail: 'user1@example.com',
      user_role: 'user',
      points: 100,
    },
    {
      id_user: uuidv4(),
      username: 'user2',
      password_hash: 'hashedpassword2',
      mail: 'user2@example.com',
      user_role: 'admin',
      points: 300,
    },
  ];

  for (const user of users) {
    const id_rank = getRankIdByPoints(user.points);

    await prisma.users.upsert({
      where: { mail: user.mail },
      update: {},
      create: {
        ...user,
        id_rank,
      },
    });
  }

  console.log('Users seeded');
};

