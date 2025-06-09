'use client';

import { useState, useEffect } from 'react';
import { TopLeaderboard } from './TopLeaderboard';
import { TopPerformersSkeleton } from './LoadingSkeletons';

export default function TopPerformersSection() {
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopPerformers() {
      try {
        const response = await fetch('/api/leaderboard/top?limit=5');
        const data = await response.json();
        setTopPerformers(data.success ? data.topUsers : []);
      } catch (error) {
        console.error('Error fetching top performers:', error);
        setTopPerformers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTopPerformers();
  }, []);

  if (loading) {
    return <TopPerformersSkeleton />;
  }

  return <TopLeaderboard topUsers={topPerformers || []} />;
} 