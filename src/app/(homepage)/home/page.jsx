import { CodeChallenge } from "./components"; 
import { FeaturedCodeChallenge } from "./components";

export default function Homepage() {
  return (
    <div className="flex flex-col w-full px-6 py-5 max-w-7xl mx-auto font-mono">
      {/* Featured Challenge */}
      <div className="w-full mb-12">
        <FeaturedCodeChallenge />
      </div>

      {/* Active Challenges Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-mahindra-white mb-6">Active Challenges</h2>
        
        {/* Grid de desafíos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Desafío - Easy */}
          <div className="w-full">
            <CodeChallenge />
          </div>
          
          {/* Desafío - Medium */}
          <div className="w-full">
            <CodeChallenge />
          </div>
          
          {/* Desafío - Hard */}
          <div className="w-full">
            <CodeChallenge />
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Homepage',
  description: 'Start your journey with CodeArena',
};