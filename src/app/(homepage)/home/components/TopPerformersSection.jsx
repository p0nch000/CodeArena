import { TopLeaderboard } from './TopLeaderboard';

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.SITE_URL) {
    return process.env.SITE_URL;
  }
  return 'http://localhost:3000';
};

async function getTopPerformers() {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/leaderboard/top?limit=5`, {
      cache: 'no-store'
    });
    const data = await response.json();
    return data.success ? data.topUsers : [];
  } catch (error) {
    console.error('Error fetching top performers:', error);
    return [];
  }
}

export default async function TopPerformersSection() {
  const topPerformers = await getTopPerformers();
  
  return <TopLeaderboard topUsers={topPerformers || []} />;
} 