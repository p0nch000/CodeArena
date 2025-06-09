import { TopLeaderboard } from './TopLeaderboard';

const getBaseUrl = () => {
  const vercelUrl = process.env.VERCEL_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  console.log('🔍 [TopPerformers] Environment variables:');
  console.log('  VERCEL_URL:', vercelUrl);
  console.log('  NEXT_PUBLIC_SITE_URL:', siteUrl);
  
  let baseUrl;
  if (vercelUrl) {
    baseUrl = `https://${vercelUrl}`;
  } else if (siteUrl) {
    baseUrl = siteUrl;
  } else {
    baseUrl = 'http://localhost:3000';
  }
  
  console.log('  🎯 [TopPerformers] Selected baseUrl:', baseUrl);
  return baseUrl;
};

async function getTopPerformers() {
  try {
    const baseUrl = getBaseUrl();
    const fullUrl = `${baseUrl}/api/leaderboard/top?limit=5`;
    
    console.log('🚀 [TopPerformers] Fetching from:', fullUrl);
    
    const response = await fetch(fullUrl, {
      cache: 'no-store'
    });
    
    console.log('📡 [TopPerformers] Response status:', response.status);
    console.log('📡 [TopPerformers] Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [TopPerformers] Response not ok. Error text:', errorText);
      return [];
    }
    
    const data = await response.json();
    console.log('✅ [TopPerformers] Data received:', data);
    console.log('✅ [TopPerformers] Users count:', data.topUsers?.length || 0);
    
    return data.success ? data.topUsers : [];
  } catch (error) {
    console.error('💥 [TopPerformers] Error:', error);
    console.error('💥 [TopPerformers] Error name:', error.name);
    console.error('💥 [TopPerformers] Error message:', error.message);
    console.error('💥 [TopPerformers] Error cause:', error.cause);
    return [];
  }
}

export default async function TopPerformersSection() {
  const topPerformers = await getTopPerformers();
  
  return <TopLeaderboard topUsers={topPerformers || []} />;
} 