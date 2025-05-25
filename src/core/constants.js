// Judge0 
export const LANGUAGES = {
  JAVASCRIPT_NODE: {
    id: 63, // Judge0 ID for Node.js 12.14.0
    name: "JavaScript (Node.js 12.14.0)",
    extension: "js",
    monacoLanguage: "javascript"
  },
  JAVASCRIPT_NODE_18: {
    id: 93, // Judge0 ID for Node.js 18.15.0
    name: "JavaScript (Node.js 18.15.0)",
    extension: "js",
    monacoLanguage: "javascript"
  },
  JAVASCRIPT_NODE_20: {
    id: 97, // Judge0 ID for Node.js 20.17.0
    name: "JavaScript (Node.js 20.17.0)",
    extension: "js",
    monacoLanguage: "javascript"
  },
  JAVASCRIPT_NODE_LATEST: {
    id: 102, // Judge0 ID for Node.js 22.08.0
    name: "JavaScript (Node.js 22.08.0)",
    extension: "js",
    monacoLanguage: "javascript"
  },
  PYTHON: {
    id: 71, // Judge0 ID for Python 3.8.1
    name: "Python (3.8.1)",
    extension: "py",
    monacoLanguage: "python"
  },
  PYTHON_311: {
    id: 92, // Judge0 ID for Python 3.11.2
    name: "Python (3.11.2)",
    extension: "py",
    monacoLanguage: "python"
  },
  PYTHON_LATEST: {
    id: 100, // Judge0 ID for Python 3.12.5
    name: "Python (3.12.5)",
    extension: "py",
    monacoLanguage: "python"
  },
  CPP: {
    id: 54, // Judge0 ID for C++ (GCC 9.2.0)
    name: "C++ (GCC 9.2.0)",
    extension: "cpp",
    monacoLanguage: "cpp"
  },
  CPP_LATEST: {
    id: 105, // Judge0 ID for C++ (GCC 14.1.0)
    name: "C++ (GCC 14.1.0)",
    extension: "cpp",
    monacoLanguage: "cpp"
  }
};

// Helper function to get language options array
export const getLanguageOptions = () => {
  return Object.values(LANGUAGES).map(lang => lang.name);
};

// Helper function to get language by name
export const getLanguageByName = (name) => {
  return Object.values(LANGUAGES).find(lang => lang.name === name);
};

// Code templates for each language type
export const CODE_TEMPLATES = {
  javascript: `/**
 * Solution to the problem
 * @param {Object} input - Object with the problem input (fields depend on the problem).
 * @return {*} - The expected result for the problem.
 */
function solution(input) {
  // You can access input fields, for example:
  // const { nums, target } = input;
  // Check the problem statement to see which fields are available.
  let result;

  return result;
}`,

  python: `def solution(**kwargs):
    """
    Solution to the problem

    Args:
        The arguments depend on the problem (see the statement).

    Returns:
        The expected result for the problem.
    """
    # You can access input fields, for example:
    # nums = kwargs.get("nums")
    # target = kwargs.get("target")
    # Check the problem statement to see which fields are available.
    result = None

    return result`,

  cpp: `/**
 * Solution to the problem
 * 
 * The input parameter is a JSON-like string containing the problem data.
 * Example: {"nums": [2,7,11,15], "target": 9}
 * 
 * You need to:
 * 1. Parse the input string to extract the data
 * 2. Solve the problem with that data
 * 3. Return the result as a string (for arrays, use format like "[1,2]")
 */
#include <string>
#include <vector>
#include <sstream>
#include <iostream>

std::string solution(std::string input) {
    // Example: Parse a JSON-like input string
    // Input format: {"nums": [2,7,11,15], "target": 9}
    
    // 1. Extract array values (between [ and ])
    size_t arrayStart = input.find("[");
    size_t arrayEnd = input.find("]");
    if (arrayStart != std::string::npos && arrayEnd != std::string::npos) {
        std::string arrayStr = input.substr(arrayStart + 1, arrayEnd - arrayStart - 1);
        std::vector<int> nums;
        std::stringstream ss(arrayStr);
        std::string token;
        
        while (std::getline(ss, token, ',')) {
            // Remove whitespace
            token.erase(0, token.find_first_not_of(" \\t"));
            token.erase(token.find_last_not_of(" \\t") + 1);
            if (!token.empty()) {
                nums.push_back(std::stoi(token));
            }
        }
    }
    
    // 2. Extract single values (like "target": 9)
    size_t targetPos = input.find("\\"target\\":");
    if (targetPos != std::string::npos) {
        size_t valueStart = input.find_first_of("0123456789-", targetPos);
        size_t valueEnd = input.find_first_not_of("0123456789-", valueStart);
        if (valueEnd == std::string::npos) valueEnd = input.length();
        
        int target = std::stoi(input.substr(valueStart, valueEnd - valueStart));
    }
    
    // 3. Solve your problem here
    // ...
    
    // 4. Return result as string
    // For single values: return std::to_string(result);
    // For arrays: return "[1,2,3]"; or build string manually
    
    return ""; // Replace with your solution
}`
};

// Helper function to get template by language extension
export const getCodeTemplate = (languageName) => {
  const language = getLanguageByName(languageName);
  if (!language) return '// Select a language to see the template.';
  
  return CODE_TEMPLATES[language.extension] || CODE_TEMPLATES[language.monacoLanguage] || '// Template not available for this language.';
};

export const STATUS = {
  IN_QUEUE: { id: 1, description: "In Queue" },
  PROCESSING: { id: 2, description: "Processing" },
  ACCEPTED: { id: 3, description: "Accepted" },
  WRONG_ANSWER: { id: 4, description: "Wrong Answer" },
  TIME_LIMIT_EXCEEDED: { id: 5, description: "Time Limit Exceeded" },
  COMPILATION_ERROR: { id: 6, description: "Compilation Error" },
  RUNTIME_ERROR_SIGSEGV: { id: 7, description: "Runtime Error (SIGSEGV)" },
  RUNTIME_ERROR_SIGXFSZ: { id: 8, description: "Runtime Error (SIGXFSZ)" },
  RUNTIME_ERROR_SIGFPE: { id: 9, description: "Runtime Error (SIGFPE)" },
  RUNTIME_ERROR_SIGABRT: { id: 10, description: "Runtime Error (SIGABRT)" },
  RUNTIME_ERROR_NZEC: { id: 11, description: "Runtime Error (NZEC)" },
  RUNTIME_ERROR_OTHER: { id: 12, description: "Runtime Error (Other)" },
  INTERNAL_ERROR: { id: 13, description: "Internal Error" },
  EXEC_FORMAT_ERROR: { id: 14, description: "Exec Format Error" },
};

export const DEFAULT_SUBMISSION_CONFIG = {
  cpu_time_limit: 2,
  cpu_extra_time: 0.5,
  wall_time_limit: 5,
  memory_limit: 128000, 
  stack_limit: 64000, 
  max_processes_and_or_threads: 30,
  enable_per_process_and_thread_time_limit: false,
  enable_per_process_and_thread_memory_limit: true,
  max_file_size: 1024, 
};

export const JUDGE0_ENDPOINTS = {
  SUBMISSIONS: '/submissions',
  SUBMISSIONS_BATCH: '/submissions/batch',
  LANGUAGES: '/languages',
  STATUSES: '/statuses',
};
