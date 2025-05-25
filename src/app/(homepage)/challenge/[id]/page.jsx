'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import ProblemStatement from './components/ProblemStatement';
import CodeOutput from './components/Output';
import Dropdown from '@/components/Dropdown';
import dynamic from 'next/dynamic';
import { 
  LANGUAGES, 
  getLanguageOptions, 
  getLanguageByName, 
  getCodeTemplate 
} from '@/core/constants';

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
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES.JAVASCRIPT_NODE.name);
  const [isRunning, setIsRunning] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [code, setCode] = useState('');
  const languageOptions = getLanguageOptions();
  
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

  useEffect(() => {
    const template = getCodeTemplate(selectedLanguage);
    setCode(template);
  }, [selectedLanguage]);

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
  };

  const getCurrentLanguage = () => {
    return getLanguageByName(selectedLanguage);
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
      
      const response = await fetch(`/api/challenges/${id}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          language: selectedLanguage
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
  };

  const currentLanguage = getCurrentLanguage();

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
                    language={currentLanguage?.monacoLanguage || 'plaintext'}
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