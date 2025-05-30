/**
 * Wraps user code in language-specific boilerplate to handle input/output
 * @param {string} code - User's solution code
 * @param {string} language - Programming language name
 * @returns {string} - Wrapped code ready for Judge0
 */
export function wrapCodeForJudge0(code, language) {  
  if (language.includes('JavaScript')) {
    return `
const fs = require('fs');
let inputString; // Renamed for clarity
try {
  inputString = fs.readFileSync(0, 'utf8').trim();
} catch (error) {
  console.error('Error reading input file:', error.message);
  process.exit(1);
}

let parsedInput;
try {
  if (inputString === "") { // Handle empty input string if it should be empty JSON object
      parsedInput = {}; // Or based on problem spec, could be an error
  } else {
      parsedInput = JSON.parse(inputString);
  }
} catch (error) {
  console.error('Error parsing input JSON:', error.message, '\\nInput string was:', inputString);
  process.exit(1);
}

${code} // User's solution code

try {
  // Pass the parsed JSON object to the user's solution function
  const result = solution(parsedInput); 
  console.log(JSON.stringify(result));
} catch (error) {
  console.error('Error in solution:', error.message);
  process.exit(1);
}`;
  }
  
  if (language.includes('Python')) {
    return `
import sys
import json
import traceback

${code} # User's solution code

try:
    input_string = sys.stdin.read().strip()
    parsed_input = None
    try:
        if not input_string: # Handle empty input string
            parsed_input = {} # Or based on problem spec
        else:
            parsed_input = json.loads(input_string)
    except json.JSONDecodeError as e:
        print(f"Error parsing input JSON: {e}.\\nInput string was: {input_string}", file=sys.stderr)
        sys.exit(1)
    
    result = None
    # Try to call solution by unpacking parsed_input as keyword arguments
    try:
        result = solution(**parsed_input)
    except TypeError: # Handles if solution doesn't accept **kwargs or names mismatch
        try:
            # Fallback: pass the parsed_input as a single argument (dict)
            result = solution(parsed_input)
        except Exception as e_sol_fallback:
            print(f"Error calling solution function (fallback): {e_sol_fallback}", file=sys.stderr)
            print(f"Traceback: {traceback.format_exc()}", file=sys.stderr)
            sys.exit(1)
    except Exception as e_sol_kwargs: # Catch other errors from solution(**parsed_input)
        print(f"Error calling solution function (with kwargs): {e_sol_kwargs}", file=sys.stderr)
        print(f"Traceback: {traceback.format_exc()}", file=sys.stderr)
        sys.exit(1)

    try:
        print(json.dumps(result, separators=(',', ':')))
    except TypeError: # If result is not JSON serializable (e.g. simple int/str)
        print(result)
except Exception as e_outer:
    print(f"Outer error in Python wrapper: {e_outer}", file=sys.stderr)
    print(f"Traceback: {traceback.format_exc()}", file=sys.stderr)
    sys.exit(1)`;
  }
  
  if (language.includes('C++')) {
    return `
#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include <unordered_map>
#include <typeinfo>

${code} // User's solution code

// Helper function to output vector<int> as JSON array
void outputVector(const std::vector<int>& vec) {
  std::cout << "[";
  for (size_t i = 0; i < vec.size(); i++) {
    std::cout << vec[i];
    if (i < vec.size() - 1) std::cout << ",";
  }
  std::cout << "]";
}

int main() {
  try {
    // Read all input as a single string
    std::string input;
    std::string line;
    while (std::getline(std::cin, line)) {
      input += line + "\\n";
    }
    
    // Remove trailing newline if present
    if (!input.empty() && input.back() == '\\n') {
      input.pop_back();
    }
    
    // Call user's solution function with the input string
    auto result = solution(input);
    
    // Output the result - since most competitive programming problems
    // return vector<int> for array results, we'll format it as JSON
    outputVector(result);
    std::cout << std::endl;
    
  } catch (const std::exception& e) {
    std::cerr << "Error: " << e.what() << std::endl;
    return 1;
  } catch (...) {
    std::cerr << "Unknown error occurred" << std::endl;
    return 1;
  }
  
  return 0;
}`;
  }
  // Fallback if language is not recognized
  return code;
}