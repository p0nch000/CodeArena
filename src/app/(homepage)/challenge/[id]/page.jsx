'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import ProblemStatement from './components/ProblemStatement';
import CodeOutput from './components/Output';
import Dropdown from '@/components/Dropdown';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('./components/MonacoEditor'), { ssr: false });

export default function CodeChallengeSolve() {
  const params = useParams();
  const [id, setId] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('Python (3.12.5)');

  useEffect(() => {
    if (params?.id) {
      setId(params.id);
    }
  }, [params]);

  const problemData = {
    title: "Two Sum",
    difficulty: "Medium",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.Given an array of integers nums and an integer target, return indices of the Given an array of integers nums and an integer target, return indices of the ",
    example: {
      number: 1,
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]"
    },
    constraints: [
      "2 ≤ nums.length ≤ 104",
      "-109 ≤ nums[i] ≤ 109",
      "-109 ≤ target ≤ 109"
    ]
  };

  const [testResults, setTestResults] = useState({
    runtime: "42ms",
    memory: "14.2 MB",
    testCases: [
      {
        number: 1,
        passed: true,
        input: "[2,7,11,15], target = 9",
        output: "[0,1]"
      },
      {
        number: 2,
        passed: false,
        input: "[3,2,4], target = 6",
        output: "[0,1]"
      },
      {
        number: 3,
        passed: true,
        input: "[3,2,4], target = 6",
        output: "[0,1]"
      }
    ]
  });

  // Array simplificado con solo los nombres de los lenguajes
  const languageOptions = [
    "JavaScript (Node.js 12.14.0)",
    "JavaScript (Node.js 22.08.0)",
    "Python (3.8.1)",
    "Python (3.12.5)",
    "Java (JDK 17.0.6)",
    "C++ (GCC 9.2.0)",
    "C++ (GCC 14.1.0)",
    "C (GCC 9.2.0)",
    "C (GCC 14.1.0)",
    "C# (Mono 6.6.0.161)",
    "Go (1.13.5)",
    "Go (1.23.5)",
    "Rust (1.40.0)",
    "Rust (1.85.0)",
    "TypeScript (3.7.4)",
    "TypeScript (5.6.2)"
  ];

  // Mapeo de los nombres de lenguajes a los identificadores de Monaco
  const monacoLanguageMap = {
    "JavaScript (Node.js 12.14.0)": 'javascript',
    "JavaScript (Node.js 22.08.0)": 'javascript',
    "Python (3.8.1)": 'python',
    "Python (3.12.5)": 'python',
    "Java (JDK 17.0.6)": 'java',
    "C++ (GCC 9.2.0)": 'cpp',
    "C++ (GCC 14.1.0)": 'cpp',
    "C (GCC 9.2.0)": 'c',
    "C (GCC 14.1.0)": 'c',
    "C# (Mono 6.6.0.161)": 'csharp',
    "Go (1.13.5)": 'go',
    "Go (1.23.5)": 'go',
    "Rust (1.40.0)": 'rust',
    "Rust (1.85.0)": 'rust',
    "TypeScript (3.7.4)": 'typescript',
    "TypeScript (5.6.2)": 'typescript'
  };

  // Mapeo de los nombres de lenguajes a las plantillas de código
  const codeTemplates = {
    "JavaScript (Node.js 12.14.0)": `function twoSum(nums, target) {\n  // Write your code here\n  return [];\n}`,
    "JavaScript (Node.js 22.08.0)": `function twoSum(nums, target) {\n  // Write your code here\n  return [];\n}`,
    "Python (3.8.1)": `def twoSum(nums, target):\n    # Write your code here\n    pass`,
    "Python (3.12.5)": `def twoSum(nums, target):\n    # Write your code here\n    pass`,
    "Java (JDK 17.0.6)": `public int[] twoSum(int[] nums, int target) {\n    // Write your code here\n    return new int[]{0, 1};\n}`,
    "C++ (GCC 9.2.0)": `vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n    return {0, 1};\n}`,
    "C++ (GCC 14.1.0)": `vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n    return {0, 1};\n}`,
    "C (GCC 9.2.0)": `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your code here\n    *returnSize = 2;\n    int* result = malloc(2 * sizeof(int));\n    result[0] = 0;\n    result[1] = 1;\n    return result;\n}`,
    "C (GCC 14.1.0)": `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your code here\n    *returnSize = 2;\n    int* result = malloc(2 * sizeof(int));\n    result[0] = 0;\n    result[1] = 1;\n    return result;\n}`,
    "C# (Mono 6.6.0.161)": `public int[] TwoSum(int[] nums, int target) {\n    // Write your code here\n    return new int[] {0, 1};\n}`,
    "Go (1.13.5)": `func twoSum(nums []int, target int) []int {\n    // Write your code here\n    return []int{0, 1}\n}`,
    "Go (1.23.5)": `func twoSum(nums []int, target int) []int {\n    // Write your code here\n    return []int{0, 1}\n}`,
    "Rust (1.40.0)": `pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n    // Write your code here\n    vec![0, 1]\n}`,
    "Rust (1.85.0)": `pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n    // Write your code here\n    vec![0, 1]\n}`,
    "TypeScript (3.7.4)": `function twoSum(nums: number[], target: number): number[] {\n    // Write your code here\n    return [0, 1];\n}`,
    "TypeScript (5.6.2)": `function twoSum(nums: number[], target: number): number[] {\n    // Write your code here\n    return [0, 1];\n}`
  };

  const [code, setCode] = useState(codeTemplates[selectedLanguage]);

  useEffect(() => {
    setCode(codeTemplates[selectedLanguage]);
  }, [selectedLanguage]);

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
  };

  const handleRunCode = () => {
    console.log("Running code...");
  };

  const handleSubmit = () => {
    console.log("Submitting solution...");
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#0f1729] text-white font-mono">
      <div className="flex flex-row h-full">
        <div className="w-1/3 bg-[#0f1729] p-6 overflow-y-auto flex items-start">
          <ProblemStatement {...problemData} />
        </div>

        <div className="flex-1 flex flex-col h-full overflow-hidden mr-6">
          <PanelGroup direction="vertical" className="h-full">
            {/* Barra de lenguajes con esquinas superiores redondeadas */}
            <div className="bg-[#1f2937] rounded-t-lg px-2 pt-2 mt-6 flex items-center border-b border-zinc-700">
              <div className="ml-3 pb-2 flex space-x-2">
                <Dropdown
                  options={languageOptions}
                  label=""
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="w-48"
                  color="dark-blue-dropdown"
                />
              </div>
            </div>

            {/* Editor de código */}
            <Panel defaultSize={60} minSize={40} className="bg-[#1f2937]">
              <div className="h-full">
                <div className="h-full p-4 overflow-y-auto rounded-xl">
                  <MonacoEditor
                    language={monacoLanguageMap[selectedLanguage]}
                    value={code}
                    onChange={(newValue) => setCode(newValue)}
                    options={{
                      automaticLayout: true,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      lineNumbers: 'on',
                      glyphMargin: false,
                      folding: true,
                      lineDecorationsWidth: 10,
                      fontSize: 14
                    }}
                  />
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className="h-2 bg-zinc-700 hover:bg-zinc-500 transition cursor-row-resize">
              <div className="flex justify-center items-center h-full">
                <div className="w-10 h-1 bg-zinc-500 rounded"></div>
              </div>
            </PanelResizeHandle>

            {/* Output Panel */}
            <Panel defaultSize={40} minSize={30} className="bg-[#1f2937] rounded-b-lg mb-6">
              <div className="p-4 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-lg font-medium">Output</div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleRunCode}
                      className="flex items-center gap-1 bg-[#dc3545] text-white px-3 py-1 text-sm rounded hover:bg-opacity-90 transition"
                    >
                      <span>▶</span> Run Code
                    </button>
                    <button 
                      onClick={handleSubmit}
                      className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-opacity-90 transition"
                    >
                      <span>↗</span> Submit
                    </button>
                  </div>
                </div>
                <CodeOutput {...testResults} />
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}