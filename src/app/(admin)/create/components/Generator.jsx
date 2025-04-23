"use client";
import { useState } from "react";

export default function Generator() {
    const [difficulty, setDifficulty] = useState(''); 
    return(
        <div className="bg-mahindra-dark-blue rounded-lg p-6 shadow-lg font-mono">
          <h2 className="text-2xl text-mahindra-white font-semibold mb-2">Personalizador de Code Challenge</h2>
          
          {/* Difficulty Selection */}
          <div className="mb-3">
            <p className="mb-3 text-mahindra-light-gray">Dificultad</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <button 
                  className={`py-2 px-6 rounded-full transition-colors ${
                    difficulty === 'easy' ? 'bg-green-600 text-white' : 'bg-green-900/40 text-green-400 hover:bg-green-800/60'
                  }`}
                  onClick={() => setDifficulty('easy')}
                >
                  Easy
                </button>
                <button 
                  className={`py-2 px-6 rounded-full transition-colors ${
                    difficulty === 'medium' ? 'bg-yellow-600 text-white' : 'bg-yellow-900/40 text-yellow-400 hover:bg-yellow-800/60'
                  }`}
                  onClick={() => setDifficulty('medium')}
                >
                  Medium
                </button>
                <button 
                  className={`py-2 px-6 rounded-full transition-colors ${
                    difficulty === 'hard' ? 'bg-red-600 text-white' : 'bg-red-900/40 text-red-400 hover:bg-red-800/60'
                  }`}
                  onClick={() => setDifficulty('hard')}
                >
                  Hard
                </button>
              </div>

              {/* Botón Generar */}
              <button className="flex items-center justify-center bg-mahindra-red text-mahindra-white py-3 px-6 rounded-md transition-colors">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Generar
              </button>
            </div>
          </div>
        </div>
    );
}