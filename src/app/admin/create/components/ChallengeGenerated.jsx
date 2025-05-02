"use client";

export default function ChallengeGenerated({ challenge }) {
  if (!challenge) {
    return (
      <div className="bg-mahindra-dark-blue rounded-lg p-6 shadow-lg font-mono">
        <p className="text-gray-400">No se ha generado ningún desafío aún.</p>
      </div>
    );
  }

  // Extraer propiedades con valores predeterminados
  const title = challenge.title || "Untitled Challenge";
  const description = challenge.description || "No description available";
  
  // Manejar ejemplos que podrían ser objetos, arreglos o cadenas
  let examplesContent;
  if (typeof challenge.examples === 'object' && challenge.examples !== null) {
    if (Array.isArray(challenge.examples)) {
      // Si los ejemplos son un arreglo, formatear cada ejemplo
      examplesContent = challenge.examples.map((example, idx) => {
        if (typeof example === 'object') {
          return `Ejemplo ${idx+1}:\nEntrada: ${JSON.stringify(example.input, null, 2)}\nSalida: ${JSON.stringify(example.output, null, 2)}`;
        }
        return String(example);
      }).join('\n\n');
    } else {
      // Si los ejemplos son un único objeto (común en desafíos más difíciles)
      examplesContent = `Entrada: ${JSON.stringify(challenge.examples.input, null, 2)}\nSalida: ${JSON.stringify(challenge.examples.output, null, 2)}`;
    }
  } else {
    // Si los ejemplos son una cadena u otro tipo primitivo
    examplesContent = challenge.examples ? String(challenge.examples) : "No se proporcionaron ejemplos";
  }
  
  // Asegurarse de que las restricciones sean un arreglo
  let constraints = [];
  if (Array.isArray(challenge.constraints)) {
    constraints = challenge.constraints;
  } else if (typeof challenge.constraints === 'string') {
    // Si las restricciones son una cadena, dividir por saltos de línea
    constraints = challenge.constraints.split('\n').filter(line => line.trim());
  } else if (typeof challenge.constraints === 'object' && challenge.constraints !== null) {
    // Manejar el caso donde las restricciones podrían ser un objeto
    constraints = ["No se pudieron mostrar correctamente las restricciones. Por favor, verifica el formato de la respuesta de la API."];
  }

  return (
    <div className="bg-mahindra-dark-blue rounded-lg p-6 shadow-lg font-mono">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-mono text-mahindra-white">{title}</h2>
      </div>

      <div className="mb-6">
        <h3 className="font-mono mb-2 text-mahindra-white">Descripción:</h3>
        <div className="bg-gray-900 p-4 rounded-md font-mono text-mahindra-light-gray whitespace-pre-wrap">
          {description}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-mono mb-2 text-mahindra-white">Ejemplo:</h3>
        <div className="bg-gray-900 p-4 rounded-md font-mono text-mahindra-light-gray whitespace-pre-wrap">
          {examplesContent}
        </div>
      </div>

      <div>
        <h3 className="font-mono mb-2 text-mahindra-white">Restricciones:</h3>
        <div className="bg-gray-900 p-4 rounded-md font-mono text-mahindra-light-gray">
          {constraints.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {constraints.map((constraint, index) => (
                <li key={index}>{constraint}</li>
              ))}
            </ul>
          ) : (
            <p>No se especificaron restricciones</p>
          )}
        </div>
      </div>
    </div>
  );
}