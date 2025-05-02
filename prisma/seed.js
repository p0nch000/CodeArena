//const { ranks } = require('./seeders/seedRanks');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const seedRanks = require('./seeders/seedRanks')
const seedUsers = require('./seeders/seedUsers')
const seedChallenges = require('./seeders/seedChallenges')
const seedChallengeMetrics = require('./seeders/seedChallengeMetrics')
const seedTestCases = require('./seeders/seedTestCases')
const seedSubmissions = require('./seeders/seedSubmissions')
const seedSubmissionResults = require('./seeders/seedSubmissionResults')
const seedUpdateUserRanks = require('./seeders/seedUpdateUserRanks')
const seedAdminSubmissions = require('./seeders/seedAdminSubmissions')
const seedAdminSubmissionResults = require('./seeders/seedAdminSubmissionResults')

async function main() {
  await seedRanks(prisma)
  await seedUsers(prisma)
  await seedChallenges(prisma)
  await seedChallengeMetrics(prisma)
  await seedTestCases(prisma)
  await seedSubmissions(prisma)
  await seedSubmissionResults(prisma)
  await seedUpdateUserRanks(prisma)
  await seedAdminSubmissions(prisma)
  await seedAdminSubmissionResults(prisma)
}

main()
.then(() => {
    console.log("Seeding completo");
  })
.catch(e =>{
    console.log(e);
    process.exit(1);
} )
.finally(() => {
    prisma.$disconnect();
})