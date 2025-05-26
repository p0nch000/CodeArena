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
        for (const challenge of results) {
          if (challenge) challengeCache.addChallenge(difficulty, challenge);
        }
        
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
    "Input: specific_param = [1,2,4], another_param = [1,3,4]\\nOutput: [1,1,2,3,4,4]\\nExplanation: Step-by-step explanation of how this output is derived",
    "Input: different_example = 'hello world', target = 'l'\\nOutput: [2, 3, 9]\\nExplanation: Detailed explanation of this different scenario"
  ],
  "constraints": [
    "Specific input size limits (e.g., 1 ≤ n ≤ 10^5)",
    "Time complexity requirements (e.g., O(n log n) expected)",
    "Memory constraints (e.g., Maximum memory usage: 256MB)",
    "Input format specifications",
    "Any other relevant constraints"
  ],
  "runtime": 500,
  "memory": 128,
  "deadline": "2023-06-07T00:00:00.000Z",
  "test_cases": [
    {
      "input": {"array": [1,5,8,10,14,19], "k": 3},
      "output": "Expected output 1"
    },
    {
      "input": {"string": "hello world", "char": "l"},
      "output": "Expected output 2"
    },
    {
      "input": {"matrix": [[1,2,3],[4,5,6],[7,8,9]]},
      "output": "Expected output 3"
    },
    {
      "input": {"n": 5, "edges": [[0,1],[1,2],[2,3],[3,4]]},
      "output": "Expected output 4"
    },
    {
      "input": {"tree": [3,9,20,null,null,15,7]},
      "output": "Expected output 5"
    },
    {
      "input": {"value": 42},
      "output": "Expected output 6"
    }
  ]
}

CRITICAL FORMATTING REQUIREMENTS:

1. EXAMPLES FORMAT: The "examples" field must be an array of strings, where each string follows this exact format:
   "Input: param_name = value, other_param = value\\nOutput: result_value\\nExplanation: detailed explanation"
   
2. Use \\n for line breaks within the example strings
3. Make parameter names descriptive and relevant to the problem context
4. Ensure examples are easy to read and understand at a glance

5. TEST CASES: ALL test case inputs MUST be valid JSON objects with appropriate keys and values
   - The "input" field in each test case MUST be a JSON object, NOT a string
   - For array problems, use format like: {"nums": [1,5,8,10,14,19], "target": 24}
   - For string problems, use format like: {"s": "example string", "k": 3}
   - Create 5-6 different test cases that thoroughly test the solution
   - Include edge cases and various complexity scenarios

6. UNIQUENESS: Avoid these common problem types:
   - Two Sum, Three Sum, or any sum-finding variants
   - Palindrome checking or creation
   - Binary search implementations
   - Basic sorting or searching
   - Standard tree/graph traversals (DFS, BFS) unless with unique twist
   - Fibonacci or factorial calculations
   - Prime number generation
   - Anagram detection
   - Longest common subsequence/substring
   - Basic dynamic programming patterns

Instead, focus on:
   - Creative data transformations
   - Unique pattern recognition
   - Game-like scenarios with custom rules
   - Real-world simulation problems
   - Novel mathematical relationships
   - Creative string/array manipulations with unique logic

Tailor the challenge difficulty appropriately: 
- Easy: Creative but straightforward logic, basic data structures
- Medium: Requires creative thinking and moderate optimization
- Hard: Complex creative algorithms, multiple optimization steps, or advanced creative concepts

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
    // Create a date one week from now
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    const validatedChallenge = {
      title: challenge.title || "Code Challenge",
      description: challenge.description || "No provided description",
      examples: challenge.examples || ["Input: value = 1\nOutput: 1\nExplanation: Basic example"],
      constraints: Array.isArray(challenge.constraints) ? 
        challenge.constraints : 
        [challenge.constraints?.toString() || "No provided constraints"],
      test_cases: challenge.test_cases || [],
      runtime: challenge.runtime || this.getDefaultRuntime(challenge.difficulty),
      memory: challenge.memory || this.getDefaultMemory(challenge.difficulty),
      deadline: challenge.deadline || oneWeekFromNow.toISOString()
    };
    
    if (!Array.isArray(validatedChallenge.constraints) || validatedChallenge.constraints.length === 0) {
      validatedChallenge.constraints = ["No provided constraints"];
    }
  
    // Ensure examples is an array of readable strings
    if (!Array.isArray(validatedChallenge.examples)) {
      if (typeof validatedChallenge.examples === 'string') {
        validatedChallenge.examples = [validatedChallenge.examples];
      } else if (typeof validatedChallenge.examples === 'object' && validatedChallenge.examples !== null) {
        if (Array.isArray(validatedChallenge.examples)) {
          validatedChallenge.examples = validatedChallenge.examples.map(example => {
            if (typeof example === 'object' && example.input && example.output) {
              const inputStr = typeof example.input === 'object' ? 
                Object.entries(example.input).map(([key, value]) => `${key} = ${JSON.stringify(value)}`).join(', ') :
                `value = ${example.input}`;
              const explanation = example.explanation ? `\nExplanation: ${example.explanation}` : '';
              return `Input: ${inputStr}\nOutput: ${example.output}${explanation}`;
            }
            return example.toString();
          });
        } else {
          if (validatedChallenge.examples.input && validatedChallenge.examples.output) {
            const inputStr = typeof validatedChallenge.examples.input === 'object' ? 
              Object.entries(validatedChallenge.examples.input).map(([key, value]) => `${key} = ${JSON.stringify(value)}`).join(', ') :
              `value = ${validatedChallenge.examples.input}`;
            const explanation = validatedChallenge.examples.explanation ? `\nExplanation: ${validatedChallenge.examples.explanation}` : '';
            validatedChallenge.examples = [`Input: ${inputStr}\nOutput: ${validatedChallenge.examples.output}${explanation}`];
          } else {
            validatedChallenge.examples = ["Input: value = 1\nOutput: 1\nExplanation: Basic example"];
          }
        }
      } else {
        validatedChallenge.examples = ["Input: value = 1\nOutput: 1\nExplanation: Basic example"];
      }
    }
    
    // Ensure test_cases is an array of input/output objects with proper JSON structure
    if (!Array.isArray(validatedChallenge.test_cases)) {
      if (typeof validatedChallenge.test_cases === 'string' && validatedChallenge.test_cases.trim()) {
        try {
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
              const inputValue = trimmedLine.substring(6).trim();
              try {
                currentCase.input = JSON.parse(inputValue);
              } catch (e) {
                currentCase.input = { "value": inputValue };
              }
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
            validatedChallenge.test_cases = this.generateTestCasesFromExamples(validatedChallenge.examples);
          }
        } catch (e) {
          console.warn("Failed to parse test cases string", e);
          validatedChallenge.test_cases = this.generateTestCasesFromExamples(validatedChallenge.examples);
        }
      } else {
        validatedChallenge.test_cases = this.generateTestCasesFromExamples(validatedChallenge.examples);
      }
    }
    
    // Ensure each test case has input and output properties with proper JSON structure
    validatedChallenge.test_cases = validatedChallenge.test_cases.map(tc => {
      if (tc && typeof tc === 'object' && tc.input !== undefined && tc.output !== undefined) {
        if (typeof tc.input === 'string') {
          try {
            tc.input = JSON.parse(tc.input);
          } catch (e) {
            tc.input = { "value": tc.input };
          }
        }
        else if (typeof tc.input !== 'object' || tc.input === null) {
          tc.input = { "value": tc.input };
        }
        
        // Format output properly for Judge0 comparison
        tc.output = this.formatOutputForJudge0(tc.output);
        
        return tc;
      }
      return null;
    }).filter(Boolean);
    
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
  
  // New method to format output for Judge0 comparison
  formatOutputForJudge0(output) {
    if (output === null || output === undefined) {
      return "null";
    }
    
    // If it's already a string representation of a value, return as is
    if (typeof output === 'string') {
      // Check if it's a JSON string (array, object, etc.)
      try {
        const parsed = JSON.parse(output);
        return JSON.stringify(parsed);
      } catch (e) {
        // If it's not valid JSON, check if it looks like a string value
        // If it doesn't start and end with quotes, and it's not a number/boolean/null, wrap it
        const trimmed = output.trim();
        if (!trimmed.match(/^-?\d+(\.\d+)?$/) && // not a number
            !trimmed.match(/^(true|false|null)$/i) && // not boolean/null
            !trimmed.startsWith('"') && !trimmed.endsWith('"') && // not already quoted
            !trimmed.startsWith('[') && !trimmed.startsWith('{')) { // not array/object
          return `"${output}"`;
        }
        return output;
      }
    }
    
    // For other types, use JSON.stringify to ensure proper formatting
    return JSON.stringify(output);
  }
  
  generateTestCasesFromExamples(examples) {
    const testCases = [];
    
    try {
      if (Array.isArray(examples)) {
        for (const example of examples) {
          if (example && typeof example === 'object' && example.input !== undefined && example.output !== undefined) {
            let input = example.input;
            if (typeof input === 'string') {
              try {
                input = JSON.parse(input);
              } catch (e) {
                input = { "value": input };
              }
            } 
            else if (typeof input !== 'object' || input === null) {
              input = { "value": input };
            }
            
            testCases.push({
              input: input,
              output: this.formatOutputForJudge0(example.output)
            });
          }
        }
      } 
      else if (examples && typeof examples === 'object' && examples.input !== undefined && examples.output !== undefined) {
        let input = examples.input;
        if (typeof input === 'string') {
          try {
            input = JSON.parse(input);
          } catch (e) {
            input = { "value": input };
          }
        }
        else if (typeof input !== 'object' || input === null) {
          input = { "value": input };
        }
        
        testCases.push({
          input: input,
          output: this.formatOutputForJudge0(examples.output)
        });
      }
      
      if (testCases.length > 0) {
        const sampleInput = testCases[0].input;
        const keys = Object.keys(sampleInput);
        
        if (keys.length > 0) {
          if (keys.includes('nums') || keys.includes('array')) {
            testCases.push({
              input: { [keys[0]]: [1, 2, 3, 4], ...(keys[1] ? { [keys[1]]: 2 } : {}) },
              output: this.formatOutputForJudge0("Expected output for simple test")
            });
            
            testCases.push({
              input: { [keys[0]]: [], ...(keys[1] ? { [keys[1]]: 0 } : {}) },
              output: this.formatOutputForJudge0("Expected output for edge case")
            });
          } else if (keys.includes('s') || keys.includes('string')) {
            testCases.push({
              input: { [keys[0]]: "test", ...(keys[1] ? { [keys[1]]: "t" } : {}) },
              output: this.formatOutputForJudge0("Expected output for simple test")
            });
            
            testCases.push({
              input: { [keys[0]]: "", ...(keys[1] ? { [keys[1]]: "" } : {}) },
              output: this.formatOutputForJudge0("Expected output for edge case")
            });
          } else {
            testCases.push({
              input: { [keys[0]]: sampleInput[keys[0]] },
              output: this.formatOutputForJudge0("Expected output for simple test")
            });
            
            const edgeValue = typeof sampleInput[keys[0]] === 'number' ? 0 : 
                             Array.isArray(sampleInput[keys[0]]) ? [] : "";
            testCases.push({
              input: { [keys[0]]: edgeValue },
              output: this.formatOutputForJudge0("Expected output for edge case")
            });
          }
        } else {
          testCases.push({
            input: { "value": 42 },
            output: this.formatOutputForJudge0("Expected output for simple test")
          });
          
          testCases.push({
            input: { "value": 0 },
            output: this.formatOutputForJudge0("Expected output for edge case")
          });
        }
      } else {
        testCases.push(
          { input: { "array": [1, 5, 8, 10, 14, 19] }, output: this.formatOutputForJudge0("Expected output 1") },
          { input: { "string": "hello world" }, output: this.formatOutputForJudge0("Expected output 2") },
          { input: { "n": 5, "k": 3 }, output: this.formatOutputForJudge0("Expected output 3") }
        );
      }
    } catch (e) {
      console.warn("Error generating test cases from examples", e);
      testCases.push(
        { input: { "value": 42 }, output: this.formatOutputForJudge0("Default expected output 1") },
        { input: { "array": [1, 2, 3] }, output: this.formatOutputForJudge0("Default expected output 2") }
      );
    }
    
    return testCases;
  }

  getDefaultRuntime(difficulty) {
    if (!difficulty) return 500; // Default for medium
    
    switch(difficulty.toLowerCase()) {
      case 'easy': return 300;
      case 'medium': return 500;
      case 'hard': return 1000;
      default: return 500;
    }
  }

  getDefaultMemory(difficulty) {
    if (!difficulty) return 128; // Default for medium
    
    switch(difficulty.toLowerCase()) {
      case 'easy': return 64;
      case 'medium': return 128;
      case 'hard': return 256;
      default: return 128;
    }
  }
}

export default new Deepseek();