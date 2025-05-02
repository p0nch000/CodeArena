module.exports = async function seedRanks(prisma) {
    const ranks = [
      {
        name: 'Bronze Coder',
        min_points: 0,
        icon_url: "/AssetBronzeBadge.png"
      },
      {
        name: 'Silver Developer',
        min_points: 1000,
        icon_url: "/AssetSilverBadge.png"
      },
      {
        name: 'Gold Engineer',
        min_points: 2000,
        icon_url: "/AssetGoldBadge.png"
      },
      {
        name: 'Platinum Architect',
        min_points: 3000,
        icon_url: "/AssetPlatinumBadge.png"
      },
      {
        name: 'Diamond Debugger',
        min_points: 4000,
        icon_url: "/AssetEliteBadge.png"
      },
      {
        name: 'Elite Codebreaker',
        min_points: 5000,
        icon_url: "/AssetEliteBadge.png"
      }
    ];
  
    for (const rank of ranks) {
      await prisma.ranks.upsert({
        where: { name: rank.name },
        update: {
          min_points: rank.min_points,
          icon_url: rank.icon_url
        },
        create: rank
      });
    }
  
    console.log('Ranks seeded');
  };
  
