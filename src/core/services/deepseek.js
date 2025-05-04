import OpenAI from "openai";
require('dotenv').config();

class DeepSeek {
  constructor() {
    this.openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: process.env.DEEPSEEK_API_KEY,
    });
  }

  async generateCodeChallenge(prompt) {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: `You are an expert code challenge creator tasked with generating creative, unique, and educational coding problems.

Your challenges should:
1. Be original and avoid common/classic algorithm problems
2. Be precisely defined with clear requirements
3. Include detailed explanations and examples
4. Provide appropriate difficulty-based constraints

Based on the difficulty provided by the user, generate a coding challenge with this specific JSON structure:

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
}

Tailor the challenge difficulty appropriately: 
- Easy: Solvable with basic data structures and simple algorithms
- Medium: Requires deeper algorithmic understanding and optimization
- Hard: Involves complex algorithms, multiple optimization steps, or advanced concepts

Return ONLY valid JSON without additional text, code blocks, or formatting.` 
          },
          { role: "user", content: prompt },
        ],
        model: "deepseek-chat",
      });
      const content = completion.choices[0].message.content;
      let challenge;
      try {
        const jsonMatch = content.match(/```json\s*({[\s\S]*?})\s*```/) || 
                         content.match(/```\s*({[\s\S]*?})\s*```/) || 
                         content.match(/({[\s\S]*})/);
                         
        const jsonContent = jsonMatch ? jsonMatch[1] : content;
        challenge = JSON.parse(jsonContent.trim());
      } catch (jsonError) {
        console.warn("The response is not JSON, trying to process as plain text...", jsonError);
        challenge = this.parseChallengeFromText(content);
      }
      return this.ensureValidChallengeFormat(challenge);
    } catch (error) {
      console.error("Error generating the coding challenge:", error);
      throw new Error("Failed to generate the coding challenge");
    }
  }
  
  parseChallengeFromText(content) {
    const lines = content.split("\n");
    const challenge = {
      title: "Code Challenge",
      description: "",
      examples: "",
      constraints: []
    };
  
    const titleLine = lines.find(line => line.match(/^#\s+/) || line.match(/^Title:\s+/i));
    if (titleLine) {
      challenge.title = titleLine.replace(/^#\s+|^Title:\s+/i, "").trim();
    }
  
    let currentSection = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.match(/^##?\s+Description/i) || line.match(/^Description:/i)) {
        currentSection = "description";
        continue;
      } 
      
      if (line.match(/^##?\s+Examples?/i) || line.match(/^Examples?:/i)) {
        currentSection = "examples";
        continue;
      } 
      
      if (line.match(/^##?\s+Constraints?/i) || line.match(/^Constraints?:/i)) {
        currentSection = "constraints";
        continue;
      } 
      
      if (line.match(/^##?\s+/)) {
        currentSection = null;
        continue;
      }
      
      if (currentSection === "description") {
        challenge.description += `${line}\n`;
      } else if (currentSection === "examples") {
        challenge.examples += `${line}\n`;
      } else if (currentSection === "constraints") {
        if (line.trim().length > 0) {
          const cleanedLine = line.replace(/^[-*•]|\d+[.)]\s*/, "").trim();
          if (cleanedLine) {
            challenge.constraints.push(cleanedLine);
          }
        }
      }
    }
    challenge.description = challenge.description.trim();
    challenge.examples = challenge.examples.trim();
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
  
  ensureValidChallengeFormat(challenge) {
    const validatedChallenge = {
      title: challenge.title || "Code Challenge",
      description: challenge.description || "No provided description",
      examples: challenge.examples || "No provided examples",
      constraints: Array.isArray(challenge.constraints) ? 
        challenge.constraints : 
        [challenge.constraints?.toString() || "No provided constraints"]
    };
    
    if (!Array.isArray(validatedChallenge.constraints) || validatedChallenge.constraints.length === 0) {
      validatedChallenge.constraints = ["No provided constraints"];
    }
  
    if (typeof validatedChallenge.examples === 'object' && validatedChallenge.examples !== null) {
      if (validatedChallenge.examples.example) {
        validatedChallenge.examples = validatedChallenge.examples.example;
      } else if (validatedChallenge.examples.examples) {
        validatedChallenge.examples = validatedChallenge.examples.examples;
      }
      
    }
    
    if (Array.isArray(validatedChallenge.constraints)) {
      validatedChallenge.constraints = validatedChallenge.constraints.map(constraint => {
        if (typeof constraint === 'string') {
          return constraint.trim();
        }
        if (typeof constraint === 'object' && constraint !== null) {
          try {
            return JSON.stringify(constraint);
          } catch (e) {
            return "Complex constraint";
          }
        }
        return String(constraint);
      });
    }
    
    return validatedChallenge;
  }
}

const deepseekService = new DeepSeek();
export default deepseekService;