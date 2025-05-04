import { FeaturedCodeChallenge } from './index';

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.SITE_URL) {
    return process.env.SITE_URL;
  }
  return 'http://localhost:3000';
};

async function getFeaturedChallenge() {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/challenges/featured`, { 
      cache: 'no-store' 
    });
    const data = await response.json();
    return data.success ? data.featuredChallenge : null;
  } catch (error) {
    console.error('Error fetching featured challenge:', error);
    return null;
  }
}

export default async function FeaturedChallengeSection() {
  const featuredChallenge = await getFeaturedChallenge();
  
  return <FeaturedCodeChallenge challenge={featuredChallenge} />;
} 