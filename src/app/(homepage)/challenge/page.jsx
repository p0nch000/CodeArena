"use client";
import { useState } from "react";
import { CodeChallengeFull } from "./components";
import Dropdown from "../../../components/Dropdown";

export default function Challenge() {
    // Filter states
    const [difficultyFilter, setDifficultyFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    
    // Format difficulty options for the Dropdown component
    const difficultyOptions = [
        { key: "all", label: "All" },
        { key: "easy", label: "Easy" },
        { key: "medium", label: "Medium" },
        { key: "hard", label: "Hard" }
    ];
    
    // Format date options for the Dropdown component
    const dateOptions = [
        { key: "all", label: "All" },
        { key: "newest", label: "Newest" },
        { key: "oldest", label: "Oldest" }
    ];
    
    return (
        <div className="flex flex-col w-full px-8 py-8 max-w-screen-2xl mx-auto font-mono">
            {/* Page Title - Added more padding */}
            <div className="py-6 px-2 mb-4">
                <h1 className="text-4xl font-bold text-white">Code Challenges</h1>
            </div>
            
            {/* Main content with filters and challenges - Wider content area */}
            <div className="flex flex-col md:flex-row gap-10 p-4">
                {/* Filters panel */}
                <div className="w-full md:w-80 bg-mahindra-dark-blue rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Filters</h2>
                    
                    {/* Difficulty filter using custom Dropdown */}
                    <div className="mb-8">
                        <label className="block text-mahindra-light-gray text-sm mb-3">
                            Difficulty
                        </label>
                        <Dropdown 
                            options={difficultyOptions} 
                            label="Difficulty"
                            value={difficultyFilter}
                            onChange={(val) => setDifficultyFilter(val)}
                            className="w-full bg-mahindra-black text-white"
                        />
                    </div>
                    
                    {/* Date filter using custom Dropdown */}
                    <div className="mb-8">
                        <label className="block text-mahindra-light-gray text-sm mb-3">
                            Date
                        </label>
                        <Dropdown 
                            options={dateOptions} 
                            label="Date"
                            value={dateFilter}
                            onChange={(val) => setDateFilter(val)}
                            className="w-full bg-mahindra-black text-white"
                        />
                    </div>
                    
                    {/* Apply filters button */}
                    <button className="w-full bg-mahindra-red hover:bg-red-600 text-mahindra-white px-6 py-3 rounded-md text-sm font-medium transition-colors">
                        Apply Filters
                    </button>
                </div>
                
                {/* Challenges column - More space between items */}
                <div className="flex-1">
                    <div className="space-y-8">
                        <CodeChallengeFull difficulty="Medium" />
                        <CodeChallengeFull difficulty="Easy" />
                        <CodeChallengeFull difficulty="Hard" />
                    </div>
                </div>
            </div>
        </div>
    );
}