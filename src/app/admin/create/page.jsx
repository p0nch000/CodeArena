"use client";
import { useState } from "react";
import { Generator } from "./components";
import { ActionButtons } from "./components";
import { ChallengeGenerated } from "./components";
import Link from "next/link";

export default function Create() {
  const [challenge, setChallenge] = useState(null);

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

        {/* Generator component */}
        <div className="w-full">
          <Generator onGenerate={(generatedChallenge) => setChallenge(generatedChallenge)} />
        </div>
        
        {/* Challenge preview */}
        <div className="w-full">
          <ChallengeGenerated challenge={challenge} />
        </div>
        
        {/* Action buttons - only show if challenge exists */}
        {challenge && (
          <div className="w-full mt-4">
            <ActionButtons />
          </div>
        )}
      </div>
    </div>
  );
}