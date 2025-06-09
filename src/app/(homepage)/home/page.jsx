import FeaturedChallengeSection from './components/FeaturedChallengeSection';
import ActiveChallengesSection from './components/ActiveChallengesSection';
import TopPerformersSection from './components/TopPerformersSection';

export const dynamic = 'force-dynamic';

export default function Homepage() {
  return (
    <div className="flex flex-col w-full px-6 py-5 max-w-7xl mx-auto font-mono">
      {/* Featured Challenge */}
      <div className="w-full mb-12">
        <FeaturedChallengeSection />
      </div>

      {/* Active Challenges Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-mahindra-white mb-6">Active Challenges</h2>
        <ActiveChallengesSection />
      </div>

      {/* Top Performers Section */}
      <h2 className="text-2xl font-bold text-mahindra-white mb-6">Top Performers</h2>
      <div className="bg-mahindra-dark-blue border border-gray-800 rounded-xl overflow-hidden">
        <TopPerformersSection />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Homepage',
  description: 'Start your journey with CodeArena',
};