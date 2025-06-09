import { FeaturedCodeChallenge } from './index';

const getBaseUrl = () => {
  const vercelUrl = process.env.VERCEL_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  console.log('🔍 [Featured] Environment variables:');
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
  
  console.log('  🎯 [Featured] Selected baseUrl:', baseUrl);
  return baseUrl;
};

async function getFeaturedChallenge() {
  try {
    const baseUrl = getBaseUrl();
    const fullUrl = `${baseUrl}/api/challenges/featured`;
    
    console.log('🚀 [Featured] Fetching from:', fullUrl);
    
    const response = await fetch(fullUrl, { 
      cache: 'no-store' 
    });
    
    console.log('📡 [Featured] Response status:', response.status);
    console.log('📡 [Featured] Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [Featured] Response not ok. Error text:', errorText);
      return null;
    }
    
    const data = await response.json();
    console.log('✅ [Featured] Data received:', data);
    
    return data.success ? data.featuredChallenge : null;
  } catch (error) {
    console.error('💥 [Featured] Error:', error);
    console.error('💥 [Featured] Error name:', error.name);
    console.error('💥 [Featured] Error message:', error.message);
    return null;
  }
}

export default async function FeaturedChallengeSection() {
  const featuredChallenge = await getFeaturedChallenge();
  
  return <FeaturedCodeChallenge challenge={featuredChallenge} />;
} 