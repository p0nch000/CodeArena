import OpenAI from "openai";
require('dotenv').config();

class DeepseekService {
  constructor() {
    this.openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: process.env.DEEPSEEK_API_KEY,
    });
  }

  async generateCodeChallenge(prompt) {
    try {
      // Indicar al modelo que genere un desafío de codificación
      // con la estructura JSON esperada
      const completion = await this.openai.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: `You are a code challenge generator. Based on the difficulty provided by the user, generate a coding challenge with the following structure:
            {
              "title": "Challenge Title",
              "description": "Detailed description of the challenge",
              "examples": "Clear examples showing input and expected output",
              "constraints": ["constraint 1", "constraint 2", "constraint 3"]
            }
            
            Return ONLY valid JSON without additional text, code blocks, or formatting.` 
          },
          { role: "user", content: prompt },
        ],
        model: "deepseek-chat",
      });
  
      // Obtener el contenido de la respuesta
      const content = completion.choices[0].message.content;
  
      // Parsear el contenido JSON
      let challenge;
      try {
        // Extraer contenido JSON de la respuesta
        const jsonMatch = content.match(/```json\s*({[\s\S]*?})\s*```/) || 
                         content.match(/```\s*({[\s\S]*?})\s*```/) || 
                         content.match(/({[\s\S]*})/);
                         
        const jsonContent = jsonMatch ? jsonMatch[1] : content;
        challenge = JSON.parse(jsonContent.trim());
      } catch (jsonError) {
        console.warn("La respuesta no es JSON, intentando procesar como texto plano...", jsonError);
        
        // Procesar como texto plano
        challenge = this.parseChallengeFromText(content);
      }
  
      // Asegurarse de que el desafío tenga el formato correcto
      return this.ensureValidChallengeFormat(challenge);
    } catch (error) {
      console.error("Error al generar el desafío de codificación:", error);
      throw new Error("No se pudo generar el desafío de codificación");
    }
  }
  
  // Función para analizar el contenido de texto y extraer el desafío
  parseChallengeFromText(content) {
    const lines = content.split("\n");
    const challenge = {
      title: "Code Challenge",
      description: "",
      examples: "",
      constraints: []
    };
  
    // Extraer el título - buscar encabezado con # o el patrón Title:
    const titleLine = lines.find(line => line.match(/^#\s+/) || line.match(/^Title:\s+/i));
    if (titleLine) {
      challenge.title = titleLine.replace(/^#\s+|^Title:\s+/i, "").trim();
    }
  
    // Extraer secciones usando varios patrones de encabezado
    let currentSection = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.match(/^##?\s+Description/i) || line.match(/^Description:/i)) {
        currentSection = "description";
        continue;
      } else if (line.match(/^##?\s+Examples?/i) || line.match(/^Examples?:/i)) {
        currentSection = "examples";
        continue;
      } else if (line.match(/^##?\s+Constraints?/i) || line.match(/^Constraints?:/i)) {
        currentSection = "constraints";
        continue;
      } else if (line.match(/^##?\s+/)) {
        // Otra sección que no manejamos explícitamente
        currentSection = null;
        continue;
      }
      
      if (currentSection === "description") {
        challenge.description += line + "\n";
      } else if (currentSection === "examples") {
        challenge.examples += line + "\n";
      } else if (currentSection === "constraints") {
        if (line.trim().length > 0) {
          // Eliminar viñetas o numeración si están presentes
          const cleanedLine = line.replace(/^[-*•]|\d+[.)]\s*/, "").trim();
          if (cleanedLine) {
            challenge.constraints.push(cleanedLine);
          }
        }
      }
    }
    
    // Limpiar el texto
    challenge.description = challenge.description.trim();
    challenge.examples = challenge.examples.trim();
    
    // Si constraints sigue vacío pero tenemos texto en description,
    // intentar extraer elementos numerados o con viñetas del final de la descripción
    if (challenge.constraints.length === 0 && challenge.description) {
      const constraintLines = challenge.description
        .split('\n')
        .filter(line => line.match(/^[-*•]|\d+[.)]\s+/));
      
      if (constraintLines.length > 0) {
        challenge.constraints = constraintLines.map(line => 
          line.replace(/^[-*•]|\d+[.)]\s+/, "").trim()
        );
      }
    }
    
    return challenge;
  }
  
  // Asegurarse de que el desafío tenga todos los campos requeridos en el formato esperado
  ensureValidChallengeFormat(challenge) {
    const validatedChallenge = {
      title: challenge.title || "Code Challenge",
      description: challenge.description || "No se proporcionó descripción",
      examples: challenge.examples || "No se proporcionaron ejemplos",
      constraints: Array.isArray(challenge.constraints) ? 
        challenge.constraints : 
        [challenge.constraints?.toString() || "No se proporcionaron restricciones"]
    };
    
    // Asegurarse de que constraints siempre sea un array
    if (!Array.isArray(validatedChallenge.constraints) || validatedChallenge.constraints.length === 0) {
      validatedChallenge.constraints = ["No hay restricciones específicas"];
    }
    
    // Manejar estructuras complejas de ejemplos (especialmente para desafíos difíciles)
    // Si examples es un objeto con la clave example/examples, extraerlo
    if (typeof validatedChallenge.examples === 'object' && validatedChallenge.examples !== null) {
      // Algunas respuestas podrían anidar ejemplos un nivel más profundo
      if (validatedChallenge.examples.example) {
        validatedChallenge.examples = validatedChallenge.examples.example;
      } else if (validatedChallenge.examples.examples) {
        validatedChallenge.examples = validatedChallenge.examples.examples;
      }
      
      // No es necesario convertir a string aquí - el componente manejará formatos de objeto
    }
    
    // Limpiar constraints si son cadenas con saltos de línea
    if (Array.isArray(validatedChallenge.constraints)) {
      validatedChallenge.constraints = validatedChallenge.constraints.map(constraint => {
        if (typeof constraint === 'string') {
          return constraint.trim();
        }
        // Si constraint es un objeto, convertir a representación en string
        if (typeof constraint === 'object' && constraint !== null) {
          try {
            return JSON.stringify(constraint);
          } catch (e) {
            return "Restricción compleja";
          }
        }
        return String(constraint);
      });
    }
    
    return validatedChallenge;
  }
}

export default new DeepseekService();