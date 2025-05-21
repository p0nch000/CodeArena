import Deepseek from '@/core/services/deepseek';
import challengeCache from '@/core/services/challengeCache';

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 90000);
    });
    
    // Race between the actual challenge generation and the timeout
    const challenge = await Promise.race([
      Deepseek.generateCodeChallenge(prompt),
      timeoutPromise
    ]);
    
    // Get current cache status for the response
    const cacheStatus = {
      easy: challengeCache.cache.easy.length,
      medium: challengeCache.cache.medium.length,
      hard: challengeCache.cache.hard.length
    };

    return new Response(JSON.stringify({ challenge, cacheStatus }), { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/create:", error);
    
    // If error is a timeout, return a specific message
    const errorMessage = error.message === 'Request timed out' 
      ? "The request took too long to process. Please try again."
      : "Failed to generate code challenge";
      
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}