import React from 'react';

export default function ProblemStatement({
  title,
  difficulty,
  description,
  examples,
  constraints
}) {
  // Function to determine badge color based on difficulty
  const getDifficultyColor = (difficulty) => {
    const lowerDifficulty = difficulty?.toLowerCase();
    
    switch (lowerDifficulty) {
      case 'easy':
        return 'bg-emerald-700/30 text-emerald-400'; // Green for Easy
      case 'medium':
        return 'bg-amber-700/30 text-amber-400'; // Yellow for Medium
      case 'hard':
        return 'bg-red-700/30 text-red-400'; // Red for Hard
      default:
        return 'bg-gray-500'; // Default color
    }
  };

  const difficultyColor = getDifficultyColor(difficulty);

  return (
    <div className="bg-[#1f2937] rounded-lg p-6 shadow-lg text-gray-200 w-full max-w-[600px] h-full overflow-y-auto max-h-full">
      <div className="flex flex-col space-y-5">
        {/* Header */}
        <div className="flex justify-between items-start pb-4">
          <h1 className="text-2xl font-bold mb-4"><strong>{title}</strong></h1>
          <div className="flex-none">
            <span className={`${difficultyColor} px-4 py-1 text-sm rounded-full`}>
              {difficulty}
            </span>
          </div>
        </div>
        
        {/* Problem description */}
        <div className="mb-6 text-slate-300 whitespace-pre-wrap break-words">
          {description}
        </div>
        
        {/* Example - mostrar como texto */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Examples</h2>
          <div className="overflow-x-auto">
            <div className="bg-[#111827] rounded-md p-4 font-mono text-sm whitespace-pre-wrap">
              {examples}
            </div>
          </div>
        </div>
        
        {/* Constraints - mostrar como texto */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Constraints</h2>
          <div className="overflow-x-auto">
            <ul className="list-disc pl-5 text-slate-300">
              {constraints}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}