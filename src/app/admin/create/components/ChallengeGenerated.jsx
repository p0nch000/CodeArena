"use client";

export default function ChallengeGenerated({ challenge }) {
  if (!challenge) {
    return (
      <div className="bg-mahindra-dark-blue rounded-lg p-6 shadow-lg font-mono">
        <p className="text-gray-400">No generated challenge yet.</p>
      </div>
    );
  }

  const title = challenge.title || "Untitled Challenge";
  const description = challenge.description || "No description available";
  
  let examplesContent;
  if (typeof challenge.examples === 'object' && challenge.examples !== null) {
    if (Array.isArray(challenge.examples)) {
      examplesContent = challenge.examples.map((example, idx) => {
        if (typeof example === 'object') {
          return `Ejemplo ${idx+1}:\nEntrada: ${JSON.stringify(example.input, null, 2)}\nSalida: ${JSON.stringify(example.output, null, 2)}`;
        }
        return String(example);
      }).join('\n\n');
    } else {
      examplesContent = `Entrada: ${JSON.stringify(challenge.examples.input, null, 2)}\nSalida: ${JSON.stringify(challenge.examples.output, null, 2)}`;
    }
  } else {
    examplesContent = challenge.examples ? String(challenge.examples) : "No provided examples";
  }
  
  let constraints = [];
  if (Array.isArray(challenge.constraints)) {
    constraints = challenge.constraints;
  } else if (typeof challenge.constraints === 'string') {
    constraints = challenge.constraints.split('\n').filter(line => line.trim());
  } else if (typeof challenge.constraints === 'object' && challenge.constraints !== null) {
    constraints = ["Failed to display constraints. Please verify the format of the API response."];
  }

  return (
    <div className="bg-mahindra-dark-blue rounded-lg p-6 shadow-lg font-mono">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-mono text-mahindra-white">{title}</h2>
      </div>

      <div className="mb-6">
        <h3 className="font-mono mb-2 text-mahindra-white">Description:</h3>
        <div className="bg-gray-900 p-4 rounded-md font-mono text-mahindra-light-gray whitespace-pre-wrap">
          {description}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-mono mb-2 text-mahindra-white">Examples:</h3>
        <div className="bg-gray-900 p-4 rounded-md font-mono text-mahindra-light-gray whitespace-pre-wrap">
          {examplesContent}
        </div>
      </div>

      <div>
        <h3 className="font-mono mb-2 text-mahindra-white">Constraints:</h3>
        <div className="bg-gray-900 p-4 rounded-md font-mono text-mahindra-light-gray">
          {constraints.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {constraints.map((constraint, index) => (
                <li key={index}>{constraint}</li>
              ))}
            </ul>
          ) : (
            <p>No provided constraints</p>
          )}
        </div>
      </div>
    </div>
  );
}