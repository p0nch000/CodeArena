import { CodeChallenge } from './index';

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.SITE_URL) {
    return process.env.SITE_URL;
  }
  return 'http://localhost:3000';
};

async function getActiveChallenges() {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/challenges`, { 
      cache: 'no-store' 
    });
    const data = await response.json();
    return data.success ? data.activeChallenges : [];
  } catch (error) {
    console.error('Error fetching active challenges:', error);
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