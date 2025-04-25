'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import ProblemStatement from './components/ProblemStatement';
import CodeOutput from './components/Output';
import Dropdown from '@/components/Dropdown';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('./components/MonacoEditor'), { ssr: false });

// En page.jsx - Mejora la función getProblemData
async function getProblemData(id) {
  try {
    const response = await fetch(`/api/challenges/${id}`, {
      cache: 'no-store'
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.challenge;
    } else {
      console.error('Client - Error fetching problem data:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Client - Fetch error:', error);
    return null;
  }
}

export default function CodeChallengeSolve() {
  const params = useParams();
  const [id, setId] = useState(null);
  const [problemData, setProblemData] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('TypeScript (5.6.2)');
  
  useEffect(() => {
    if (params?.id) {
      setId(params.id);
    }
  }, [params]);
  
  // Corrige el useEffect para mostrar el data recibido, no problemData
  useEffect(() => {
    async function fetchProblemData() {
      if (id) {
        const data = await getProblemData(id);
        setProblemData(data);
      }
    }
    
    fetchProblemData();
  }, [id]);

  /*const problemData = {
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
  };*/

  

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
  "JavaScript (Node.js 12.14.0)": `/**
 * Solución al problema
 * @param {*} input - Ajusta los parámetros según el problema
 * @return {*} - Ajusta el tipo de retorno según el problema
 */
function solution(input) {
  // Tu código aquí
  
  return result;
}`,

  "JavaScript (Node.js 22.08.0)": `/**
 * Solución al problema
 * @param {*} input - Ajusta los parámetros según el problema
 * @return {*} - Ajusta el tipo de retorno según el problema
 */
function solution(input) {
  // Tu código aquí
  
  return result;
}`,

  "Python (3.8.1)": `def solution(input):
    """
    Solución al problema
    
    Args:
        input: Ajusta los parámetros según el problema
        
    Returns:
        Ajusta el tipo de retorno según el problema
    """
    # Tu código aquí
    
    return result`,

  "Python (3.12.5)": `def solution(input):
    """
    Solución al problema
    
    Args:
        input: Ajusta los parámetros según el problema
        
    Returns:
        Ajusta el tipo de retorno según el problema
    """
    # Tu código aquí
    
    return result`,

  "Java (JDK 17.0.6)": `/**
 * Solución al problema
 */
public class Solution {
    /**
     * @param input Ajusta los parámetros según el problema
     * @return Ajusta el tipo de retorno según el problema
     */
    public Object solve(Object input) {
        // Tu código aquí
        
        return result;
    }
}`,

  "C++ (GCC 9.2.0)": `/**
 * Solución al problema
 */
#include <vector>
#include <string>

// Ajusta los parámetros y tipo de retorno según el problema
auto solution(auto input) {
    // Tu código aquí
    
    return result;
}`,

  "C++ (GCC 14.1.0)": `/**
 * Solución al problema
 */
#include <vector>
#include <string>

// Ajusta los parámetros y tipo de retorno según el problema
auto solution(auto input) {
    // Tu código aquí
    
    return result;
}`,

  "C (GCC 9.2.0)": `/**
 * Solución al problema
 * Ajusta los parámetros y tipo de retorno según el problema
 */
#include <stdlib.h>

void* solution(void* input) {
    // Tu código aquí
    
    // No olvides liberar la memoria si es necesario
    return result;
}`,

  "C (GCC 14.1.0)": `/**
 * Solución al problema
 * Ajusta los parámetros y tipo de retorno según el problema
 */
#include <stdlib.h>

void* solution(void* input) {
    // Tu código aquí
    
    // No olvides liberar la memoria si es necesario
    return result;
}`,

  "C# (Mono 6.6.0.161)": `/**
 * Solución al problema
 */
using System;

public class Solution {
    /**
     * @param input Ajusta los parámetros según el problema
     * @return Ajusta el tipo de retorno según el problema
     */
    public object Solve(object input) {
        // Tu código aquí
        
        return result;
    }
}`,

  "Go (1.13.5)": `package main

/**
 * Solución al problema
 * Ajusta los parámetros y tipo de retorno según el problema
 */
func solution(input interface{}) interface{} {
    // Tu código aquí
    
    return result
}`,

  "Go (1.23.5)": `package main

/**
 * Solución al problema
 * Ajusta los parámetros y tipo de retorno según el problema
 */
func solution(input interface{}) interface{} {
    // Tu código aquí
    
    return result
}`,

  "Rust (1.40.0)": `/**
 * Solución al problema
 * Ajusta los parámetros y tipo de retorno según el problema
 */
pub fn solution<T, U>(input: T) -> U {
    // Tu código aquí
    
    result
}`,

  "Rust (1.85.0)": `/**
 * Solución al problema
 * Ajusta los parámetros y tipo de retorno según el problema
 */
pub fn solution<T, U>(input: T) -> U {
    // Tu código aquí
    
    result
}`,

  "TypeScript (3.7.4)": `/**
 * Solución al problema
 * @param input - Ajusta los parámetros según el problema
 * @returns Ajusta el tipo de retorno según el problema
 */
function solution(input: any): any {
  // Tu código aquí
  
  return result;
}`,

  "TypeScript (5.6.2)": `/**
 * Solución al problema
 * @param input - Ajusta los parámetros según el problema
 * @returns Ajusta el tipo de retorno según el problema
 */
function solution(input: any): any {
  // Tu código aquí
  
  return result;
}`
};

   

  const [code, setCode] = useState(codeTemplates[selectedLanguage]  || '');

  useEffect(() => {
    console.log("Lenguaje seleccionado:", selectedLanguage);
    console.log("Monaco language mapping:", monacoLanguageMap[selectedLanguage]);
    
    if (codeTemplates[selectedLanguage]) {
      setCode(codeTemplates[selectedLanguage]);
    }
  }, [selectedLanguage]);

  const handleLanguageChange = (value) => {
    console.log("Cambiando lenguaje a:", value);
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
        <div className="w-1/3 bg-[#0f1729] p-6 overflow-y-auto items-center">
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
                    language={monacoLanguageMap[selectedLanguage] || 'plaintext'}
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
              <div className="p-4 h-full overflow-y-auto pt-1">
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