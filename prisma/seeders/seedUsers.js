const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');

module.exports = async function seedUsers(prisma) {
  // Get all ranks
  const ranks = await prisma.ranks.findMany();
 
  const getRankIdByPoints = (points) => {
    const sortedRanks = [...ranks].sort((a, b) => b.min_points - a.min_points);
    const rank = sortedRanks.find(r => points >= r.min_points);
    return rank?.id_rank || null;
  };
  const users = [];
  
  // Add admin users with more points for demo
  users.push({
    id_user: uuidv4(),
    username: 'admin',
    password_hash: '$2a$10$xVqYCStE5U6MfhqM/zlpO.tfCvJaoO8/Ewo1KpXPVxVVWoUWHQOMK', // "password"
    mail: 'admin@codearena.com',
    user_role: 'admin',
    points: 25000, // Much higher points for demo
  });
  
  // Add normal users with varying ranks
  const usernames = new Set(); // To avoid duplicate usernames
  usernames.add('admin');
  
  // Distribution of points for different ranks
  const pointsRanges = [
    { min: 0, max: 1000, count: 10 },     // Bronze
    { min: 1000, max: 2000, count: 10 },     // Silver
    { min: 2000, max: 3000, count: 8 },    // Gold
    { min: 3000, max: 4000, count: 5 },    // Platinum
    { min: 4000, max: 5000, count: 3 },    // Diamond
    { min: 5000, max: 10000, count: 2 }   // Elite
  ];
  
  // Generate users for each points range
  for (const range of pointsRanges) {
    for (let i = 0; i < range.count; i++) {
      let username;
      do {
        username = faker.internet.userName().toLowerCase().replace(/[^a-z0-9_]/g, '_');
      } while (usernames.has(username));
      
      usernames.add(username);
      
      const points = faker.number.int({ min: range.min, max: range.max });
      users.push({
        id_user: uuidv4(),
        username,
        password_hash: '$2a$10$xVqYCStE5U6MfhqM/zlpO.tfCvJaoO8/Ewo1KpXPVxVVWoUWHQOMK', // "password"
        mail: faker.internet.email({ firstName: username }),
        user_role: 'user',
        points,
      });
    }
  }
  
  // Top users for the leaderboard
  const topUsernames = ['CodeMaster', 'DevNinja', 'ByteWizard', 'AlgoGuru', 'TechWiz'];
  const topPoints = [20000, 15000, 12000, 10000, 8000]; // Higher points but still below admin
  
  for (let i = 0; i < topUsernames.length; i++) {
    if (!usernames.has(topUsernames[i])) {
      usernames.add(topUsernames[i]);
      users.push({
        id_user: uuidv4(),
        username: topUsernames[i],
        password_hash: '$2a$10$xVqYCStE5U6MfhqM/zlpO.tfCvJaoO8/Ewo1KpXPVxVVWoUWHQOMK', // "password"
        mail: `${topUsernames[i].toLowerCase()}@codearena.com`,
        user_role: 'user',
        points: topPoints[i],
      });
    }
  }

  // Create users in database
  for (const user of users) {
    const id_rank = getRankIdByPoints(user.points);

    await prisma.users.upsert({
      where: { username: user.username },
      update: {
        points: user.points,
        id_rank
      },
      create: {
        ...user,
        id_rank,
      },
    });
  }

  console.log(`${users.length} Users seeded`);
};

