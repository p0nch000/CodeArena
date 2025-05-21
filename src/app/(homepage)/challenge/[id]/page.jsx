'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import ProblemStatement from './components/ProblemStatement';
import CodeOutput from './components/Output';
import Dropdown from '@/components/Dropdown';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('./components/MonacoEditor'), { ssr: false });

async function getProblemData(id) {
  try {
    const response = await fetch(`/api/challenges/${id}`, {
      cache: 'no-store'
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.challenge;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export default function CodeChallengeSolve() {
  const params = useParams();
  const [id, setId] = useState(null);
  const [problemData, setProblemData] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript (Node.js 12.14.0)');
  const [isRunning, setIsRunning] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [code, setCode] = useState('');
  
  useEffect(() => {
    if (params?.id) {
      setId(params.id);
    }
  }, [params]);
  
  useEffect(() => {
    async function fetchProblemData() {
      if (id) {
        const data = await getProblemData(id);
        setProblemData(data);
      }
    }
    
    fetchProblemData();
  }, [id]);

  const languageOptions = [
    "JavaScript (Node.js 12.14.0)",
    "JavaScript (Node.js 22.08.0)",
    "Python (3.8.1)",
    "Python (3.12.5)",
    "C++ (GCC 9.2.0)",
    "C++ (GCC 14.1.0)",
  ];

  const monacoLanguageMap = {
    "JavaScript (Node.js 12.14.0)": 'javascript',
    "JavaScript (Node.js 22.08.0)": 'javascript',
    "Python (3.8.1)": 'python',
    "Python (3.12.5)": 'python',
    "C++ (GCC 9.2.0)": 'cpp',
    "C++ (GCC 14.1.0)": 'cpp',
  };

  const codeTemplates = {
    "JavaScript (Node.js 12.14.0)": `/**
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

    "JavaScript (Node.js 22.08.0)": `/**
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

    "Python (3.8.1)": `def solution(**kwargs):
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

    "Python (3.12.5)": `def solution(**kwargs):
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

    "C++ (GCC 9.2.0)": `/**
 * Solución al problema
 */
#include <string>
#include <vector>
#include <sstream>

auto solution(std::string input) {
    // std::stringstream ss(input);
    // int num;
    // std::vector<int> numbers;
    // while (ss >> num) {
    //     numbers.push_back(num);
    // }

    // std::stringstream ss_lines(input);
    // std::string line;
    // while (std::getline(ss_lines, line, '\\n')) {
    //    // procesar line
    // }
    
    return ""; 
}`,

    "C++ (GCC 14.1.0)": `/**
 * Solución al problema
 */
#include <string>
#include <vector>
#include <sstream>

auto solution(std::string input) {
    // std::stringstream ss(input);
    // int num;
    // std::vector<int> numbers;
    // while (ss >> num) {
    //     numbers.push_back(num);
    // }

    // std::stringstream ss_lines(input);
    // std::string line;
    // while (std::getline(ss_lines, line, '\\n')) {
    //    // procesar line
    // }
    
    return "";
}`,
  };

  useEffect(() => {
    setCode(codeTemplates[selectedLanguage] || `// Select a language to see the template.`);
  }, [selectedLanguage]);

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
  };

  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      
      if (!code || code.trim() === '') {
        setRunResults({
          error: 'Please write some code before running.',
          testCases: []
        });
        return;
      }
      
      const languageName = selectedLanguage;
      
      const response = await fetch(`/api/challenges/${id}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          language: languageName
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.summary) {
        const avgExecTime = data.summary.avgExecutionTime || 0;
        const avgMemSpace = data.summary.avgMemorySpace || 0;
        
        const formattedResults = {
          runtime: `${avgExecTime.toFixed(2)}ms`,
          memory: `${(avgMemSpace / 1024).toFixed(2)} MB`,
          testCases: data.results ? data.results.map((result, index) => ({
            number: index + 1,
            passed: result.passed || false,
            input: result.input || '',
            output: result.output || '',
            expectedOutput: result.expectedOutput || '',
            errorMessage: result.errorMessage || ''
          })) : []
        };
        
        setRunResults(formattedResults);
      } else {
        setRunResults({
          error: data.error || 'Unknown error running code.',
          testCases: []
        });
      }
    } catch (error) {
      setRunResults({
        error: 'An error occurred while running your code.',
        testCases: []
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  const handleSubmit = async () => {
    // Submission functionality is disabled for now
    alert("Submission functionality is coming soon!");
    
    // Original submission code is commented out
    /*
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/challenges/${id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: selectedLanguage
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        const formattedResults = {
          runtime: `${data.summary.avgExecutionTime.toFixed(2)}ms`,
          memory: `${(data.summary.avgMemorySpace / 1024).toFixed(2)} MB`,
          testCases: data.results.map((result, index) => ({
            number: index + 1,
            passed: result.passed,
            input: "Hidden for submitted solution",
            output: result.output,
            expectedOutput: "Hidden for submitted solution",
            errorMessage: result.errorMessage
          })),
          submissionId: data.submissionId,
          allPassed: data.summary.allPassed
        };
        
        setRunResults(formattedResults);
        
        if (data.summary.allPassed) {
          alert("Congratulations! All tests passed.");
        }
      } else {
        alert(`Error submitting: ${data.error}`);
        setRunResults({
          error: `Submission Error: ${data.error}`,
          testCases: []
        });
      }
    } catch (error) {
      alert('An error occurred while submitting your code');
      setRunResults({
        error: 'An error occurred while submitting your code.',
        testCases: []
      });
    } finally {
      setIsSubmitting(false);
    }
    */
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#0f1729] text-white font-mono">
      <div className="flex flex-row h-full">
        <div className="w-1/3 bg-[#0f1729] p-6 overflow-y-auto max-h-screen">
          {problemData ? <ProblemStatement {...problemData} /> : <div className="text-slate-400">Loading problem...</div>}
        </div>

        <div className="flex-1 flex flex-col h-full overflow-hidden mr-6">
          <PanelGroup direction="vertical" className="h-full">
            <div className="bg-[#1f2937] rounded-t-lg px-2 pt-2 mt-6 flex items-center border-b border-slate-700">
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

            <Panel defaultSize={60} minSize={40} className="bg-[#1f2937]">
              <div className="h-full">
                <div className="h-full p-4 overflow-y-auto rounded-xl">
                  <MonacoEditor
                    language={monacoLanguageMap[selectedLanguage] || 'plaintext'}
                    value={code}
                    onChange={(newValue) => {
                      setCode(newValue);
                    }}
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

            <PanelResizeHandle className="h-2 bg-slate-700 hover:bg-slate-600 transition cursor-row-resize">
              <div className="flex justify-center items-center h-full">
                <div className="w-10 h-1 bg-slate-500 rounded"></div>
              </div>
            </PanelResizeHandle>

            <Panel defaultSize={50} minSize={30} className="bg-[#1f2937] rounded-b-lg mb-6">
              <div className="p-4 h-full overflow-y-auto pt-1">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-lg font-medium text-slate-200">Output</div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className={`flex items-center gap-1 ${isRunning ? 'bg-slate-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white px-3 py-1 text-sm rounded transition`}
                    >
                      {isRunning ? (
                        <>
                          <span className="animate-spin">⟳</span> Running...
                        </>
                      ) : (
                        <>
                          <span>▶</span> Run Code
                        </>
                      )}
                    </button>
                    <button 
                      onClick={handleSubmit}
                      disabled={true}
                      className="flex items-center gap-1 bg-slate-500 cursor-not-allowed text-white px-3 py-1 text-sm rounded transition"
                      title="Coming soon"
                    >
                      <span>↗</span> Submit (Coming Soon)
                    </button>
                  </div>
                </div>
                <CodeOutput {...runResults} />
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}