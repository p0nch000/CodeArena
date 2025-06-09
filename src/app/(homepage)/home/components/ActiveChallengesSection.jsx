'use client';

import { useState, useEffect } from 'react';
import { CodeChallenge } from './index';
import { ChallengeSkeleton } from './LoadingSkeletons';

export default function ActiveChallengesSection() {
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const response = await fetch('/api/challenges');
        const data = await response.json();
        setActiveChallenges(data.success ? data.activeChallenges : []);
      } catch (error) {
        console.error('Error fetching challenges:', error);
        setActiveChallenges([]);
      } finally {
        setLoading(false);
      }
    }

    fetchChallenges();
  }, []);

  if (loading) {
    return <ChallengeSkeleton />;
  }

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