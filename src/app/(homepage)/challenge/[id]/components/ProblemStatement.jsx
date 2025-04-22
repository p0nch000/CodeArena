import React from 'react';

export default function ProblemStatement({
  title,
  difficulty,
  description,
  example,
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
    <div className="bg-[#1f2937] rounded-lg p-6 shadow-lg text-gray-200 w-auto max-w-[500px]">
      <div className="flex flex-col space-y-5">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-semibold">Problem Statement</h2>
          <div className="flex-none">
            <span className={`${difficultyColor} px-4 py-1 text-sm rounded-full`}>
              {difficulty}
            </span>
          </div>
        </div>
        
        {/* Problem title */}
        <h3 className="text-xl">{title}</h3>
        
        {/* Problem description */}
        <p className="text-base text-gray-300 leading-relaxed">
          {description}
        </p>
        
        {/* Example */}
        {example && (
          <div>
            <h4 className="text-lg mb-2">Example {example.number}:</h4>
            <div className="bg-[#111827] rounded-md p-4 font-mono text-sm">
              <div>Input: {example.input}</div>
              <div>Output: {example.output}</div>
            </div>
          </div>
        )}
        
        {/* Constraints */}
        {constraints && constraints.length > 0 && (
          <div>
            <h4 className="text-lg mb-2">Constraints:</h4>
            <ul className="text-gray-300 space-y-1">
              {constraints.map((constraint, idx) => (
                <li key={idx} className="text-sm">{constraint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}