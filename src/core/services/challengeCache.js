// Store challenges in-memory 
class ChallengeCache {
  constructor() {
    this.cache = {
      easy: [],
      medium: [],
      hard: []
    };
    this.maxCacheSize = 3; // Number of challenges to cache per difficulty
  }

  // Get a cached challenge if available
  getChallenge(difficulty) {
    if (!this.cache[difficulty] || this.cache[difficulty].length === 0) {
      return null;
    }
    
    // Return a random challenge from the cache
    const randomIndex = Math.floor(Math.random() * this.cache[difficulty].length);
    const challenge = this.cache[difficulty][randomIndex];
    
    // Remove the challenge from cache to avoid duplicates
    this.cache[difficulty].splice(randomIndex, 1);
    
    return challenge;
  }

  // Add a challenge to the cache
  addChallenge(difficulty, challenge) {
    if (!this.cache[difficulty]) {
      this.cache[difficulty] = [];
    }
    
    // Don't exceed max cache size
    if (this.cache[difficulty].length < this.maxCacheSize) {
      this.cache[difficulty].push(challenge);
    }
  }

  // Pre-populate the cache with challenges
  async prePopulate(generateFunction) {
    const difficulties = ['easy', 'medium', 'hard'];
    
    // Generate challenges in parallel for each difficulty
    const populationPromises = difficulties.map(async (difficulty) => {
      // Only populate if cache isn't full
      if (this.cache[difficulty].length < this.maxCacheSize) {
        try {
          // Calculate how many more challenges we need
          const remainingSlots = this.maxCacheSize - this.cache[difficulty].length;
          
          // Create array of promises to populate the remaining slots
          const challengePromises = Array(remainingSlots).fill()
            .map(() => generateFunction(`Generate a ${difficulty} coding challenge.
          Return as valid JSON with the following structure:
          {
            "title": "Challenge Title",
            "description": "Detailed description of the challenge",
            "examples": [{"input": "Example input", "output": "Example output", "explanation": "Explanation"}],
            "constraints": ["constraint 1", "constraint 2"]
          }`));
          
          // Generate challenges in parallel
          const challenges = await Promise.all(challengePromises);
          
          // Add successful challenges to cache
          challenges.forEach(challenge => {
            if (challenge) this.addChallenge(difficulty, challenge);
          });
          
          console.log(`Added ${challenges.filter(Boolean).length} ${difficulty} challenges to cache. Total in cache: ${this.cache[difficulty].length}`);
        } catch (error) {
          console.error(`Error pre-populating ${difficulty} challenges:`, error);
        }
      } else {
        console.log(`Cache for ${difficulty} challenges is already full with ${this.cache[difficulty].length} items`);
      }
    });
    
    await Promise.all(populationPromises);
  }
}

export default new ChallengeCache();