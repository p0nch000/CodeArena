import { CodeChallenge } from './index';

const getBaseUrl = () => {
  const vercelUrl = process.env.VERCEL_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  console.log('🔍 Environment variables:');
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
  
  console.log('  🎯 Selected baseUrl:', baseUrl);
  return baseUrl;
};

async function getActiveChallenges() {
  try {
    const baseUrl = getBaseUrl();
    const fullUrl = `${baseUrl}/api/challenges`;
    
    console.log('🚀 Fetching active challenges from:', fullUrl);
    
    const response = await fetch(fullUrl, { 
      cache: 'no-store' 
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    console.log('📡 Response url:', response.url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Response not ok. Error text:', errorText);
      return [];
    }
    
    const data = await response.json();
    console.log('✅ Data received:', data);
    console.log('✅ Active challenges count:', data.activeChallenges?.length || 0);
    
    return data.success ? data.activeChallenges : [];
  } catch (error) {
    console.error('💥 Error fetching active challenges:', error);
    console.error('💥 Error name:', error.name);
    console.error('💥 Error message:', error.message);
    console.error('💥 Error stack:', error.stack);
    return [];
  }
}

export default async function ActiveChallengesSection() {
  const activeChallenges = await getActiveChallenges();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {activeChallenges && activeChallenges.length > 0 ? (
        activeChallenges.map((challenge) => (
          <div key={challenge.id_challenge} className="w-full">
            <CodeChallenge challenge={challenge} difficulty={challenge.difficulty} />
          </div>
        ))
      ) : (
        <>
          <div className="w-full">
            <CodeChallenge difficulty="Easy" />
          </div>
          <div className="w-full">
            <CodeChallenge difficulty="Medium" />
          </div>
          <div className="w-full">
            <CodeChallenge difficulty="Hard" />
          </div>
        </>
      )}
    </div>
  );
} 