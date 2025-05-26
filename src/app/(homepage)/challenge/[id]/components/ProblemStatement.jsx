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

  // Function to render examples properly
  const renderExamples = () => {
    if (!examples) return "No examples provided";
    
    let examplesArray = examples;
    
    // If examples is a string that looks like JSON, try to parse it
    if (typeof examples === 'string') {
      try {
        // Check if it's a JSON array string
        if (examples.trim().startsWith('[') && examples.trim().endsWith(']')) {
          examplesArray = JSON.parse(examples);
        } else {
          // It's a regular string, wrap it in an array
          examplesArray = [examples];
        }
      } catch (e) {
        // If parsing fails, treat as a single string
        examplesArray = [examples];
      }
    }
    
    // If examples is an array of strings (new format)
    if (Array.isArray(examplesArray)) {
      return examplesArray.map((example, index) => (
        <div key={`example-${index}-${example.substring(0, 20)}`} className="mb-4 last:mb-0">
          <div className="bg-[#111827] rounded-md p-4 font-mono text-sm whitespace-pre-wrap">
            {example}
          </div>
        </div>
      ));
    }
    
    // Fallback for any other format
    return (
      <div className="bg-[#111827] rounded-md p-4 font-mono text-sm whitespace-pre-wrap">
        {typeof examplesArray === 'string' ? examplesArray : JSON.stringify(examplesArray, null, 2)}
      </div>
    );
  };

  // Function to render constraints properly
  const renderConstraints = () => {
    if (!constraints) return <li>No constraints provided</li>;
    
    let constraintsArray = constraints;
    
    // If constraints is a string that looks like JSON, try to parse it
    if (typeof constraints === 'string') {
      try {
        if (constraints.trim().startsWith('[') && constraints.trim().endsWith(']')) {
          constraintsArray = JSON.parse(constraints);
        } else {
          constraintsArray = [constraints];
        }
      } catch (e) {
        constraintsArray = [constraints];
      }
    }
    
    // If constraints is an array
    if (Array.isArray(constraintsArray)) {
      return constraintsArray.map((constraint, index) => (
        <li key={`constraint-${index}-${constraint.substring(0, 20)}`} className="mb-1">
          {constraint}
        </li>
      ));
    }
    
    // Fallback
    return <li>{typeof constraintsArray === 'string' ? constraintsArray : JSON.stringify(constraintsArray)}</li>;
  };

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
        
        {/* Examples - render as array of formatted strings */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Examples</h2>
          <div className="overflow-x-auto">
            {renderExamples()}
          </div>
        </div>
        
        {/* Constraints - render as list */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Constraints</h2>
          <div className="overflow-x-auto">
            <ul className="list-disc pl-5 text-slate-300">
              {renderConstraints()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}