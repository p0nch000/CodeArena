"use client";
import { useState } from "react";

export default function ActionButtons({ onRegenerate, selectedDifficulty, challenge }) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleRegenerate = async () => {
    // Check if difficulty is selected and callback exists
    if (!selectedDifficulty || !onRegenerate) {
      alert("No se puede regenerar. Selecciona una dificultad primero.");
      return;
    }

    setIsRegenerating(true);
    
    try {
      await onRegenerate(selectedDifficulty);
    } catch (error) {
      console.error("Error regenerating challenge:", error);
      alert("Hubo un error al regenerar el desafío. Por favor, inténtalo de nuevo.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleApprove = async () => {
    // Reset states
    setSaveError("");
    setSaveSuccess(false);
    
    if (!challenge) {
      setSaveError("No challenge to save. Please generate a challenge first.");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Prepare the challenge data for saving
      const challengeData = {
        title: challenge.title,
        description: challenge.description,
        difficulty: selectedDifficulty,
        examples: challenge.examples,
        constraints: challenge.constraints,
        test_cases: challenge.test_cases || [],
        // Include created_by if you have user authentication
        // created_by: userId
      };
      
      const response = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(challengeData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Error al guardar el desafío");
      }
      
      // Challenge saved successfully
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000); // Clear success message after 3 seconds
      
    } catch (error) {
      console.error("Error saving challenge:", error);
      setSaveError(error.message || "No se pudo guardar el desafío. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  // Disable buttons if no challenge exists yet
  const hasChallenge = !!challenge;

  return (
    <div className="bg-mahindra-dark-blue rounded-lg p-6 shadow-lg font-mono">
      {/* Error/Success messages */}
      {saveError && (
        <div className="mb-4 p-3 bg-red-900/40 border border-red-500 rounded text-red-300">
          {saveError}
        </div>
      )}
      
      {saveSuccess && (
        <div className="mb-4 p-3 bg-green-900/40 border border-green-500 rounded text-green-300">
          Challenge successfully saved to database!
        </div>
      )}
      
      <div className="flex gap-3 font-mono justify-end">
        {/* Botón Volver a generar */}
        <button 
          className={`flex items-center justify-center ${
            isRegenerating || !hasChallenge ? 'bg-gray-700 cursor-not-allowed' : 'bg-mahindra-red hover:bg-red-700'
          } text-mahindra-white py-3 px-6 rounded-md transition-colors`}
          onClick={handleRegenerate}
          disabled={isRegenerating || !hasChallenge}
        >
          {isRegenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Regenerando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V1L8 5l4 4V6a8 8 0 1 1-8 8h2a6 6 0 1 0 6-6z" fill="currentColor" />
              </svg>
              Generate again
            </>
          )}
        </button>

        {/* Botón Aprobar */}
        <button 
          className={`flex items-center justify-center ${
            isSaving || !hasChallenge ? 'bg-gray-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          } text-mahindra-white py-3 px-6 rounded-md transition-colors`}
          onClick={handleApprove}
          disabled={isSaving || !hasChallenge}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Approve
            </>
          )}
        </button>
      </div>
    </div>
  );
}