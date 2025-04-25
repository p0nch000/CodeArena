"use client";
import { useState, useEffect } from "react";
import { CodeChallengeFull } from "./components";
import Dropdown from "../../../components/Dropdown";

export default function Challenge() {
    // Challenge state
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [difficultyFilter, setDifficultyFilter] = useState("all");
    
    // Format difficulty options for the Dropdown component
    const difficultyOptions = ["all", "easy", "medium", "hard"];

    // Function to fetch filtered challenges
    const fetchFilteredChallenges = async () => {
        setLoading(true);
        try {

                
            const response = await fetch(
                `/api/challenges/filtered?difficulty=${difficultyFilter}`
            );
            
            const data = await response.json();
            
            if (data.success) {
                setChallenges(data.filteredChallenges);
            } else {
                console.error("Error fetching challenges:", data.error);
                setChallenges([]);
            }
        } catch (error) {
            console.error("Error fetching filtered challenges:", error);
            setChallenges([]);
        } finally {
            setLoading(false);
        }
    };
        
    // Apply filters function
    const applyFilters = () => {
        fetchFilteredChallenges();
    };
    
    // Load challenges when component mounts
    useEffect(() => {
        fetchFilteredChallenges();
    }, []);
    
    return (
        <div className="flex flex-col h-[calc(100vh-120px)] w-full px-8 py-4 max-w-screen-2xl mx-auto font-mono">
          {/* Page Title - Reduced padding */}
          <div className="py-2 px-2 mb-2">
            <h1 className="text-4xl font-bold text-white">Code Challenges</h1>
          </div>
          
          {/* Main content with filters and challenges - Configurable overflow */}
          <div className="flex flex-col md:flex-row gap-6 p-2 flex-1 overflow-hidden">
            {/* Filters panel */}
            <div className="w-full md:w-80 bg-mahindra-dark-blue rounded-xl p-6 shrink-0">
              <h2 className="text-xl font-bold text-white mb-6">Filters</h2>
              
              {/* Difficulty filter using custom Dropdown */}
              <div className="mb-8">
                <Dropdown 
                  options={difficultyOptions} 
                  label="Difficulty"
                  value={difficultyFilter}
                  onChange={setDifficultyFilter}
                />
              </div>
              
              {/* Apply filters button */}
              <button 
                onClick={applyFilters}
                className="w-full bg-mahindra-red hover:bg-red-600 text-mahindra-white px-6 py-3 rounded-md text-sm font-medium transition-colors"
              >
                Apply Filters
              </button>
            </div>
            
            {/* Challenges column - Scrollable container */}
            <div className="flex-1 overflow-y-auto pr-2">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-mahindra-white">Loading challenges...</div>
                </div>
              ) : challenges.length > 0 ? (
                <div className="space-y-6 pb-4">
                  {challenges.map(challenge => (
                    <CodeChallengeFull 
                      key={challenge.id_challenge}
                      challenge={challenge}
                      difficulty={challenge.difficulty} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-mahindra-white text-center p-8">
                  No challenges found with the selected filters.
                </div>
              )}
            </div>
          </div>
        </div>
      );
}