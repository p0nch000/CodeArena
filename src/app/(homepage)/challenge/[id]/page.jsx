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
  const [selectedLanguage, setSelectedLanguage] = useState('PYTHON_LATEST');

  useEffect(() => {
    if (params?.id) {
      setId(params.id);
    }
  }, [params]);

  const problemData = {
    title: "Two Sum",
    difficulty: "Hard",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. ",
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

  const languageOptions = [
    { key: "JAVASCRIPT", label: "JavaScript (Node.js 12.14.0)" },
    { key: "JAVASCRIPT_LATEST", label: "JavaScript (Node.js 22.08.0)" },
    { key: "PYTHON", label: "Python (3.8.1)" },
    { key: "PYTHON_LATEST", label: "Python (3.12.5)" },
    { key: "JAVA", label: "Java (JDK 17.0.6)" },
    { key: "CPP", label: "C++ (GCC 9.2.0)" },
    { key: "CPP_LATEST", label: "C++ (GCC 14.1.0)" },
    { key: "C", label: "C (GCC 9.2.0)" },
    { key: "C_LATEST", label: "C (GCC 14.1.0)" },
    { key: "CSHARP", label: "C# (Mono 6.6.0.161)" },
    { key: "GO", label: "Go (1.13.5)" },
    { key: "GO_LATEST", label: "Go (1.23.5)" },
    { key: "RUST", label: "Rust (1.40.0)" },
    { key: "RUST_LATEST", label: "Rust (1.85.0)" },
    { key: "TYPESCRIPT", label: "TypeScript (3.7.4)" },
    { key: "TYPESCRIPT_LATEST", label: "TypeScript (5.6.2)" }
  ];

  const codeTemplates = {
    JAVASCRIPT: `function twoSum(nums, target) {\n  // Write your code here\n  return [];\n}`,
    JAVASCRIPT_LATEST: `function twoSum(nums, target) {\n  // Write your code here\n  return [];\n}`,
    PYTHON: `def twoSum(nums, target):\n    # Write your code here\n    pass`,
    PYTHON_LATEST: `def twoSum(nums, target):\n    # Write your code here\n    pass`,
    JAVA: `public int[] twoSum(int[] nums, int target) {\n    // Write your code here\n    return new int[]{0, 1};\n}`,
    CPP: `vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n    return {0, 1};\n}`,
    CPP_LATEST: `vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n    return {0, 1};\n}`,
    C: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your code here\n    *returnSize = 2;\n    int* result = malloc(2 * sizeof(int));\n    result[0] = 0;\n    result[1] = 1;\n    return result;\n}`,
    C_LATEST: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Write your code here\n    *returnSize = 2;\n    int* result = malloc(2 * sizeof(int));\n    result[0] = 0;\n    result[1] = 1;\n    return result;\n}`,
    CSHARP: `public int[] TwoSum(int[] nums, int target) {\n    // Write your code here\n    return new int[] {0, 1};\n}`,
    GO: `func twoSum(nums []int, target int) []int {\n    // Write your code here\n    return []int{0, 1}\n}`,
    GO_LATEST: `func twoSum(nums []int, target int) []int {\n    // Write your code here\n    return []int{0, 1}\n}`,
    RUST: `pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n    // Write your code here\n    vec![0, 1]\n}`,
    RUST_LATEST: `pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n    // Write your code here\n    vec![0, 1]\n}`,
    TYPESCRIPT: `function twoSum(nums: number[], target: number): number[] {\n    // Write your code here\n    return [0, 1];\n}`,
    TYPESCRIPT_LATEST: `function twoSum(nums: number[], target: number): number[] {\n    // Write your code here\n    return [0, 1];\n}`
  };

  const monacoLanguageMap = {
    JAVASCRIPT: 'javascript',
    JAVASCRIPT_LATEST: 'javascript',
    PYTHON: 'python',
    PYTHON_LATEST: 'python',
    JAVA: 'java',
    CPP: 'cpp',
    CPP_LATEST: 'cpp',
    C: 'c',
    C_LATEST: 'c',
    CSHARP: 'csharp',
    GO: 'go',
    GO_LATEST: 'go',
    RUST: 'rust',
    RUST_LATEST: 'rust',
    TYPESCRIPT: 'typescript',
    TYPESCRIPT_LATEST: 'typescript',
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
            <Panel defaultSize={50} minSize={40} className="bg-[#1f2937]">
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
            <Panel defaultSize={50} minSize={30} className="bg-[#1f2937] rounded-b-lg mb-6">
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