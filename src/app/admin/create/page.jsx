"use client";
import { useState, useEffect } from "react";
import { Generator } from "./components";
import { ActionButtons } from "./components";
import { ChallengeGenerated } from "./components";
import Link from "next/link";

export default function Create() {
  const [challenge, setChallenge] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cacheStatus, setCacheStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Effect to initialize cache on component mount
  useEffect(() => {
    const initializeCache = async () => {
      try {
        // Make a call to initialize cache
        await fetch("/api/admin/init-cache", {
          method: "POST",
        });
      } catch (error) {
        console.error("Failed to initialize cache:", error);
      }
    };
    
    initializeCache();
  }, []);
  
  // Function to generate a new challenge
  const handleGenerate = async (difficulty) => {
    if (!difficulty) {
      setErrorMessage("Please select a difficulty.");
      return null;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: `IMPORTANT: All content, including examples, must be written in English. Do not use any other language.
          Generate a ${difficulty} coding challenge.
          Return as valid JSON with the following structure:
          {
            "title": "Challenge Title",
            "description": "Detailed description of the challenge",
            "examples": [{"input": "Example input", "output": "Example output", "explanation": "Explanation"}],
            "constraints": ["constraint 1", "constraint 2"]
          }`
        }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Error generating the challenge: ${response.status}`);
      }
  
      const data = await response.json();
      if (!data.challenge) {
        throw new Error("Could not generate a valid challenge.");
      }
  
      // Set cache status if provided in response
      if (data.cacheStatus) {
        setCacheStatus(data.cacheStatus);
      }
  
      setChallenge(data.challenge);
      return data.challenge;
    } catch (error) {
      setErrorMessage(error.message || "There was an error generating the challenge. Please try again.");
      console.error(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for the difficulty selection
  const onDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };
  
  return (
    <div className="flex flex-col w-full px-6 py-5 max-w-7xl mx-auto font-mono bg-mahindra-navy-blue min-h-screen">
      {/* Generator section with title and back button */}
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="border-l-4 border-red-500 pl-4">
            <h1 className="text-3xl font-bold text-white mb-1">Challenge Creator</h1>
            <p className="text-gray-400 text-sm">
              Create and manage coding challenges for the platform
            </p>
          </div>
          <Link 
            href="/admin/dashboard"
            className="bg-mahindra-red hover:bg-red-600 text-mahindra-white px-6 py-2 rounded-md text-sm font-medium transition-colors transform hover:scale-105"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Cache status indicator */}
        {cacheStatus && (
          <div className="bg-blue-900/40 border border-blue-500 rounded p-3 text-blue-300 text-sm">
            <span className="font-semibold">Cache Status:</span> {cacheStatus.easy} easy, {cacheStatus.medium} medium, {cacheStatus.hard} hard challenges cached
          </div>
        )}

        {/* Generator component */}
        <div className="w-full">
          <Generator 
            onGenerate={async (difficulty) => {
              await handleGenerate(difficulty);
            }}
            onDifficultySelect={onDifficultySelect}
            isGenerating={isLoading}
            errorMessage={errorMessage}
          />
        </div>
        
        {/* Challenge preview - show skeleton when loading */}
        <div className="w-full">
          <ChallengeGenerated 
            challenge={challenge} 
            isLoading={isLoading} 
            difficulty={selectedDifficulty}
          />
        </div>
        
        {/* Action buttons - only show if challenge exists and not loading */}
        {challenge && !isLoading && (
          <div className="w-full mt-4">
            <ActionButtons 
              onRegenerate={handleGenerate}
              selectedDifficulty={selectedDifficulty}
              challenge={challenge}
            />
          </div>
        )}

        {/* Error message display */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-900 text-red-300 rounded">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}