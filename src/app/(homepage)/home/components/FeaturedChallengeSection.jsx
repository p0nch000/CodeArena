'use client';

import { useState, useEffect } from 'react';
import { FeaturedCodeChallenge } from './index';
import { FeaturedSkeleton } from './LoadingSkeletons';

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

export default function FeaturedChallengeSection() {
  const [featuredChallenge, setFeaturedChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedChallenge() {
      try {
        const response = await fetch('/api/challenges/featured');
        const data = await response.json();
        setFeaturedChallenge(data.success ? data.featuredChallenge : null);
      } catch (error) {
        console.error('Error fetching featured challenge:', error);
        setFeaturedChallenge(null);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedChallenge();
  }, []);

  if (loading) {
    return <FeaturedSkeleton />;
  }

  return <FeaturedCodeChallenge challenge={featuredChallenge} />;
} 