"use client";
import { useState } from "react";

export default function Generator({ onGenerate }) {
  const [difficulty, setDifficulty] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
          prompt: `Generate a unique and original ${difficulty} coding challenge that hasn't been seen before. Make sure it's creative and stands out from common algorithm problems.

          Return as valid JSON with the following structure:
          {
            "title": "Descriptive, Unique Challenge Title",
            "description": "Extensive detailed description that clearly explains the problem, including the precise task, input/output formats, edge cases, and any special considerations. Include 2-3 paragraphs of explanation.",
            "examples": [
              {
                "input": "Example input format with specific values",
                "output": "Expected output format with specific values",
                "explanation": "Step-by-step explanation of how the output is derived from the input"
              },
              {
                "input": "A different input example covering edge cases",
                "output": "Expected output for the edge case",
                "explanation": "Why this edge case produces this output"
              }
            ],
            "constraints": [
              "Specific input size limits (e.g., 1 ≤ n ≤ 10^5)",
              "Time complexity requirements (e.g., O(n) expected)",
              "Memory constraints (e.g., Maximum memory usage: 256MB)",
              "Input format specifications",
              "Any other relevant constraints"
            ]
          }`
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error generating the challenge: ${response.status}`);
      }
  
      const data = await response.json();
      if (!data.challenge) {
        throw new Error("Failed to generate a valid challenge.");
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
      <h2 className="text-2xl text-mahindra-white font-semibold mb-2">Code Challenge Generator</h2>

      {/* Difficulty Selection */}
      <div className="mb-3">
        <p className="mb-3 text-mahindra-light-gray">Difficulty</p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3">
            <button
              type="button"
              className={`py-2 px-6 rounded-full transition-colors ${
                difficulty === 'easy' ? 'bg-green-600 text-white' : 'bg-green-900/40 text-green-400 hover:bg-green-800/60'
              }`}
              onClick={() => setDifficulty('easy')}
            >
              Easy
            </button>
            <button
              type="button"
              className={`py-2 px-6 rounded-full transition-colors ${
                difficulty === 'medium' ? 'bg-yellow-600 text-white' : 'bg-yellow-900/40 text-yellow-400 hover:bg-yellow-800/60'
              }`}
              onClick={() => setDifficulty('medium')}
            >
              Medium
            </button>
            <button
              type="button"
              className={`py-2 px-6 rounded-full transition-colors ${
                difficulty === 'hard' ? 'bg-red-600 text-white' : 'bg-red-900/40 text-red-400 hover:bg-red-800/60'
              }`}
              onClick={() => setDifficulty('hard')}
            >
              Hard
            </button>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            className={`flex items-center justify-center ${
              isLoading ? 'bg-gray-700' : 'bg-mahindra-red hover:bg-red-700'
            } text-mahindra-white py-3 px-6 rounded-md transition-colors`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true" title="Loading indicator">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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