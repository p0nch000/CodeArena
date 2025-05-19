"use client";
import { useState, useEffect } from "react";

export default function Generator({ onGenerate, onDifficultySelect, isGenerating }) {
  const [difficulty, setDifficulty] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Update loading state if controlled externally
  useEffect(() => {
    if (isGenerating !== undefined) {
      setIsLoading(isGenerating);
    }
  }, [isGenerating]);

  // Notify parent component when difficulty changes
  useEffect(() => {
    if (onDifficultySelect) {
      onDifficultySelect(difficulty);
    }
  }, [difficulty, onDifficultySelect]);

  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
  };

  const handleGenerate = async () => {
    if (!difficulty) {
      setErrorMessage("Please select a difficulty.");
      return;
    }
  
    setIsLoading(true);
    setErrorMessage('');
  
    try {
      const response = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: `Generate a ${difficulty} coding challenge. Return as valid JSON with the following structure:
          {
            "title": "Challenge Title",
            "description": "Detailed description of the challenge",
            "examples": [{"input": "Example input", "output": "Example output", "explanation": "Explanation"}],
            "constraints": ["constraint 1", "constraint 2"]
          }
          
          For harder challenges, you can structure examples as an object with input and output fields.
          
          `
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error generating the challenge: ${response.status}`);
      }
  
      const data = await response.json();
      if (!data.challenge) {
        throw new Error("Could not generate a valid challenge.");
      }
  
      onGenerate(data.challenge);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "There was an error generating the challenge. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-mahindra-dark-blue rounded-lg p-6 shadow-lg font-mono">
      <h2 className="text-2xl text-mahindra-white font-semibold mb-2">Code Challenger Customizer</h2>

      {/* Difficulty Selection */}
      <div className="mb-3">
        <p className="mb-3 text-mahindra-light-gray">Difficulty</p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3">
            <button
              className={`py-2 px-6 rounded-full transition-colors ${
                difficulty === 'easy' ? 'bg-green-600 text-white' : 'bg-green-900/40 text-green-400 hover:bg-green-800/60'
              }`}
              onClick={() => handleDifficultySelect('easy')}
            >
              Easy
            </button>
            <button
              className={`py-2 px-6 rounded-full transition-colors ${
                difficulty === 'medium' ? 'bg-yellow-600 text-white' : 'bg-yellow-900/40 text-yellow-400 hover:bg-yellow-800/60'
              }`}
              onClick={() => handleDifficultySelect('medium')}
            >
              Medium
            </button>
            <button
              className={`py-2 px-6 rounded-full transition-colors ${
                difficulty === 'hard' ? 'bg-red-600 text-white' : 'bg-red-900/40 text-red-400 hover:bg-red-800/60'
              }`}
              onClick={() => handleDifficultySelect('hard')}
            >
              Hard
            </button>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className={`flex items-center justify-center ${
              isLoading ? 'bg-gray-700 cursor-not-allowed' : 'bg-mahindra-red hover:bg-red-700'
            } text-mahindra-white py-3 px-6 rounded-md transition-colors`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true" title="Loading indicator">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" title="Generate icon">
                  <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Generate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="mt-4 p-3 bg-red-900/40 border border-red-500 rounded text-red-300">
          {errorMessage}
        </div>
      )}
    </div>
  );
}