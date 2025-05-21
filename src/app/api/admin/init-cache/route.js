import Deepseek from '@/core/services/deepseek';
import challengeCache from '@/core/services/challengeCache';

export async function POST(req) {
  try {
    // Get current cache size for each difficulty
    const status = {
      easy: challengeCache.cache.easy.length,
      medium: challengeCache.cache.medium.length,
      hard: challengeCache.cache.hard.length
    };
    
    // Initialize cache in the background
    // We don't await this, as we want to return immediately
    Deepseek.initializeCache()
      .catch(error => console.error("Background cache initialization failed:", error));

    return new Response(JSON.stringify({ status }), { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/admin/init-cache:", error);
    return new Response(JSON.stringify({ error: "Failed to initialize challenge cache" }), { status: 500 });
  }
}