import { Suspense } from 'react';
import FeaturedChallengeSection from './components/FeaturedChallengeSection';
import ActiveChallengesSection from './components/ActiveChallengesSection';
import TopPerformersSection from './components/TopPerformersSection';
import { FeaturedSkeleton, ChallengeSkeleton, TopPerformersSkeleton } from './components/LoadingSkeletons';
export const dynamic = 'force-dynamic';

export default function Homepage() {
  return (
    <div className="flex flex-col w-full px-6 py-5 max-w-7xl mx-auto font-mono">
      {/* Featured Challenge with Suspense */}
      <div className="w-full mb-12">
        <Suspense fallback={<FeaturedSkeleton />}>
          <FeaturedChallengeSection />
        </Suspense>
      </div>

      {/* Active Challenges Section with Suspense */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-mahindra-white mb-6">Active Challenges</h2>
        <Suspense fallback={<ChallengeSkeleton />}>
          <ActiveChallengesSection />
        </Suspense>
      </div>

      {/* Top Performers Section with Suspense */}
      <h2 className="text-2xl font-bold text-mahindra-white mb-6">Top Performers</h2>
      <div className="bg-mahindra-dark-blue border border-gray-800 rounded-xl overflow-hidden">
        <Suspense fallback={<TopPerformersSkeleton />}>
          <TopPerformersSection />
        </Suspense>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Homepage',
  description: 'Start your journey with CodeArena',
};