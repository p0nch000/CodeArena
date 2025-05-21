"use client";

export default function ChallengeSkeleton({ difficulty }) {
  // Determine color based on difficulty
  const getDifficultyColor = () => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-600';
      case 'medium': return 'bg-yellow-600';
      case 'hard': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const badgeColor = getDifficultyColor();
  
  return (
    <div className="bg-mahindra-dark-blue rounded-lg p-6 shadow-lg font-mono animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-8 w-64 bg-gray-700 rounded"></div>
        {difficulty && (
          <div className={`${badgeColor} rounded-full px-3 py-1 text-xs uppercase`}>
            {difficulty}
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <h3 className="font-mono mb-2 text-mahindra-white">Description:</h3>
        <div className="bg-gray-900 p-4 rounded-md">
          <div className="h-4 bg-gray-700 rounded mb-3 w-full"></div>
          <div className="h-4 bg-gray-700 rounded mb-3 w-5/6"></div>
          <div className="h-4 bg-gray-700 rounded mb-3 w-4/5"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-mono mb-2 text-mahindra-white">Examples:</h3>
        <div className="bg-gray-900 p-4 rounded-md">
          <div className="h-4 bg-gray-700 rounded mb-3 w-full"></div>
          <div className="h-4 bg-gray-700 rounded mb-3 w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>

      <div>
        <h3 className="font-mono mb-2 text-mahindra-white">Constraints:</h3>
        <div className="bg-gray-900 p-4 rounded-md">
          <ul className="space-y-2">
            <li className="h-4 bg-gray-700 rounded w-5/6"></li>
            <li className="h-4 bg-gray-700 rounded w-4/5"></li>
            <li className="h-4 bg-gray-700 rounded w-3/4"></li>
          </ul>
        </div>
      </div>
      
      <div className="mt-4 flex justify-center">
        <div className="inline-flex items-center px-4 py-2 text-mahindra-white">
          <svg className="animate-spin mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating challenge...
        </div>
      </div>
    </div>
  );
}