import OpenAI from "openai";
import challengeCache from "./challengeCache";
require('dotenv').config();

class Deepseek {
  constructor() {
    this.openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: process.env.DEEPSEEK_API_KEY,
    });
    
    // Initialize cache in the background after a short delay
    setTimeout(() => {
      this.initializeCache();
    }, 1000);
  }
  
  // Initialize cache with pre-generated challenges
  async initializeCache() {
    console.log("Starting to pre-populate challenge cache...");
    await challengeCache.prePopulate(this.generateCodeChallengeDirectly.bind(this));
    console.log("Challenge cache pre-population complete");
  }

  async generateCodeChallenge(prompt) {
    // Extract difficulty from prompt
    const difficultyMatch = prompt.match(/Generate a (easy|medium|hard) coding challenge/i);
    const difficulty = difficultyMatch ? difficultyMatch[1].toLowerCase() : null;
    
    if (difficulty) {
      // Try to get challenge from cache first
      const cachedChallenge = challengeCache.getChallenge(difficulty);
      if (cachedChallenge) {
        console.log(`Using cached ${difficulty} challenge. Starting async cache refill.`);
        
        // Get current cache size
        const currentCacheSize = challengeCache.cache[difficulty].length;
        
        // If we're getting low on cached challenges, trigger refill in background
        if (currentCacheSize < challengeCache.maxCacheSize / 2) {
          console.log(`Cache running low (${currentCacheSize} challenges). Starting background refill.`);
          
          // Start background generation to refill multiple slots at once
          // Don't wait for this to finish - it runs in background
          const refillCount = challengeCache.maxCacheSize - currentCacheSize;
          this.refillCache(difficulty, refillCount);
        } else {
          // Just refill the one we took
          this.generateCodeChallengeDirectly(`Generate a ${difficulty} coding challenge.`)
            .then(challenge => {
              challengeCache.addChallenge(difficulty, challenge);
              console.log(`Added 1 new ${difficulty} challenge to cache`);
            })
            .catch(error => {
              console.error("Background challenge generation failed:", error);
            });
        }
        
        return cachedChallenge;
      }
    }
    
    // No cached challenge available, generate a new one
    return this.generateCodeChallengeDirectly(prompt);
  }
  
  // Helper method to refill multiple cache slots in the background
  async refillCache(difficulty, count) {
    try {
      // Generate challenges in parallel batches to avoid overwhelming the API
      const batchSize = 3;
      for (let i = 0; i < count; i += batchSize) {
        const batchCount = Math.min(batchSize, count - i);
        const batchPromises = Array(batchCount).fill()
          .map(() => this.generateCodeChallengeDirectly(`Generate a ${difficulty} coding challenge.`));
        
        const results = await Promise.all(batchPromises);
        results.forEach(challenge => {
          if (challenge) challengeCache.addChallenge(difficulty, challenge);
        });
        
        console.log(`Added ${results.filter(Boolean).length} ${difficulty} challenges to cache`);
      }
    } catch (error) {
      console.error(`Error refilling ${difficulty} cache:`, error);
    }
  }

  async generateCodeChallengeDirectly(prompt) {
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
  ],
  "test_cases": [
    {
      "input": "Test case input 1",
      "output": "Expected output 1"
    },
    {
      "input": "Test case input 2",
      "output": "Expected output 2"
    },
    {
      "input": "Test case input 3",
      "output": "Expected output 3"
    },
    {
      "input": "Test case input 4",
      "output": "Expected output 4"
    },
    {
      "input": "Test case input 5",
      "output": "Expected output 5"
    },
    {
      "input": "Test case input 6 (edge case)",
      "output": "Expected output 6"
    }
  ]
}

IMPORTANT: The "examples" array is for displaying to users in the challenge description, while the "test_cases" array contains the actual test data that will be used to validate user submissions. Make sure to:
1. Create 5-6 different test cases that thoroughly test the solution
2. Include some edge cases in the test cases
3. Make test cases distinct from the examples
4. Include a variety of input complexity and scenarios
5. Make sure test cases cover all edge cases mentioned in the description

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
    // [Existing implementation remains the same]
    const lines = content.split("\n");
    const challenge = {
      title: "Code Challenge",
      description: "",
      examples: "",
      constraints: [],
      test_cases: []
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
      
      if (line.match(/^##?\s+Test Cases?/i) || line.match(/^Test Cases?:/i)) {
        currentSection = "test_cases";
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
      } else if (currentSection === "test_cases") {
        challenge.test_cases += `${line}\n`;
      }
    }
    
    challenge.description = challenge.description.trim();
    challenge.examples = challenge.examples.trim();
    
    // Try to parse test cases from text
    if (typeof challenge.test_cases === 'string' && challenge.test_cases.trim()) {
      try {
        // Extract test cases from text
        const testCasePairs = [];
        let currentInput = null;
        
        const testCaseLines = challenge.test_cases.trim().split('\n');
        for (const line of testCaseLines) {
          if (line.toLowerCase().includes('input:')) {
            currentInput = line.split('input:')[1].trim();
          } else if (line.toLowerCase().includes('output:') && currentInput) {
            const output = line.split('output:')[1].trim();
            testCasePairs.push({ input: currentInput, output });
            currentInput = null;
          }
        }
        
        if (testCasePairs.length > 0) {
          challenge.test_cases = testCasePairs;
        } else {
          challenge.test_cases = [];
        }
      } catch (e) {
        console.warn("Failed to parse test cases from text", e);
        challenge.test_cases = [];
      }
    }
    
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
    // [Existing implementation remains the same]
    const validatedChallenge = {
      title: challenge.title || "Code Challenge",
      description: challenge.description || "No provided description",
      examples: challenge.examples || "No provided examples",
      constraints: Array.isArray(challenge.constraints) ? 
        challenge.constraints : 
        [challenge.constraints?.toString() || "No provided constraints"],
      test_cases: challenge.test_cases || []
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
    
    // Ensure test_cases is an array of input/output objects
    if (!Array.isArray(validatedChallenge.test_cases)) {
      // If test_cases is a string, try to convert it to an array of objects
      if (typeof validatedChallenge.test_cases === 'string' && validatedChallenge.test_cases.trim()) {
        try {
          // Simple parsing: look for Input: and Output: patterns
          const lines = validatedChallenge.test_cases.split('\n');
          const testCases = [];
          let currentCase = {};
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.toLowerCase().startsWith('input:')) {
              if (currentCase.input) {
                testCases.push({...currentCase});
                currentCase = {};
              }
              currentCase.input = trimmedLine.substring(6).trim();
            } else if (trimmedLine.toLowerCase().startsWith('output:')) {
              currentCase.output = trimmedLine.substring(7).trim();
              if (currentCase.input && currentCase.output) {
                testCases.push({...currentCase});
                currentCase = {};
              }
            }
          }
          
          if (testCases.length > 0) {
            validatedChallenge.test_cases = testCases;
          } else {
            // Generate basic test cases from examples
            validatedChallenge.test_cases = this.generateTestCasesFromExamples(validatedChallenge.examples);
          }
        } catch (e) {
          console.warn("Failed to parse test cases string", e);
          validatedChallenge.test_cases = this.generateTestCasesFromExamples(validatedChallenge.examples);
        }
      } else {
        // Generate default test cases if none provided
        validatedChallenge.test_cases = this.generateTestCasesFromExamples(validatedChallenge.examples);
      }
    }
    
    // Ensure each test case has input and output properties
    validatedChallenge.test_cases = validatedChallenge.test_cases.filter(tc => 
      tc && typeof tc === 'object' && tc.input !== undefined && tc.output !== undefined
    );
    
    // Generate default test cases if none valid
    if (validatedChallenge.test_cases.length === 0) {
      validatedChallenge.test_cases = this.generateTestCasesFromExamples(validatedChallenge.examples);
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
  
  generateTestCasesFromExamples(examples) {
    // [Existing implementation remains the same]
    const testCases = [];
    
    try {
      // Handle array of examples
      if (Array.isArray(examples)) {
        examples.forEach(example => {
          if (example && typeof example === 'object' && example.input !== undefined && example.output !== undefined) {
            testCases.push({
              input: example.input,
              output: example.output
            });
          }
        });
      } 
      // Handle single example object
      else if (examples && typeof examples === 'object' && examples.input !== undefined && examples.output !== undefined) {
        testCases.push({
          input: examples.input,
          output: examples.output
        });
      }
      
      // If we have at least one test case from examples, create a couple of variations
      if (testCases.length > 0) {
        // Add a simple baseline test case
        testCases.push({
          input: "Simple test input",
          output: "Expected output for simple test"
        });
        
        // Add an edge case test
        testCases.push({
          input: "Edge case input (e.g., empty array, maximum value, etc.)",
          output: "Expected output for edge case"
        });
      } else {
        // If no usable examples, create some default test cases
        testCases.push(
          { input: "Test input 1", output: "Expected output 1" },
          { input: "Test input 2", output: "Expected output 2" },
          { input: "Test input 3", output: "Expected output 3" }
        );
      }
    } catch (e) {
      console.warn("Error generating test cases from examples", e);
      // Fallback to default test cases
      testCases.push(
        { input: "Default test input 1", output: "Default expected output 1" },
        { input: "Default test input 2", output: "Default expected output 2" }
      );
    }
    
    return testCases;
  }
}

export default new Deepseek();