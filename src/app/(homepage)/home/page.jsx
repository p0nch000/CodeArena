import { CodeChallenge } from "./components"; 
import { FeaturedCodeChallenge } from "./components";
import Leaderboard from "@/components/Leaderboard";

async function getFeaturedChallenge() {
  try {
    const response = await fetch(`${process.env.SITE_URL}/api/challenges/featured`, { 
      cache: 'no-store' 
    });
    const data = await response.json();
    return data.success ? data.featuredChallenge : null;
  } catch (error) {
    console.error('Error fetching featured challenge:', error);
    return null;
  }
} 

async function getActiveChallenges() {
  try {
    const response = await fetch(`${process.env.SITE_URL}/api/challenges`, { 
      cache: 'no-store' 
    });
    const data = await response.json();
    return data.success ? data.activeChallenges : [];
  } catch (error) {
    console.error('Error fetching active challenges:', error);
    return [];
  }
}

export default async function Homepage() {
  const featuredChallenge = await getFeaturedChallenge();
  const activeChallenges = await getActiveChallenges();

  return (
    <div className="flex flex-col w-full px-6 py-5 max-w-7xl mx-auto font-mono">
      {/* Featured Challenge */}
      <div className="w-full mb-12">
        <FeaturedCodeChallenge challenge={featuredChallenge} />
      </div>

      {/* Active Challenges Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-mahindra-white mb-6">Active Challenges</h2>
        
        {/* Grid de desafíos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {activeChallenges.length > 0 ? (
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

        {/* Top Performers Section */}
        <h2 className="text-2xl font-bold text-mahindra-white mb-6">Top Performers</h2>
        <Leaderboard />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Homepage',
  description: 'Start your journey with CodeArena',
};