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
import { useAuthRedirect } from '@/core/hooks/useAuthRedirect';

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

async function checkUserSubmission(challengeId, userId) {
  try {
    const response = await fetch(`/api/challenges/${challengeId}/submission-status?userId=${userId}`, {
      cache: 'no-store'
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    return { hasSubmitted: false, submission: null };
  }
}

export default function CodeChallengeSolve() {
  const params = useParams();
  const { user, loading } = useAuthRedirect();
  const [id, setId] = useState(null);
  const [problemData, setProblemData] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES.JAVASCRIPT_NODE.name);
  const [isRunning, setIsRunning] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResults, setSubmitResults] = useState(null);
  const [code, setCode] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);
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
    async function checkSubmissionStatus() {
      const userId = user?.id;
      if (id && userId) {
        const data = await checkUserSubmission(id, userId);
        setHasSubmitted(data.hasSubmitted);
        setSubmissionData(data.submission);
        
        if (data.hasSubmitted && data.submission) {
          setCode(data.submission.code);
          setSelectedLanguage(data.submission.language);
        }
      }
    }
    
    checkSubmissionStatus();
  }, [id, user]);

  useEffect(() => {
    if (!hasSubmitted) {
      const template = getCodeTemplate(selectedLanguage);
      setCode(template);
    }
  }, [selectedLanguage, hasSubmitted]);

  const handleLanguageChange = (value) => {
    if (hasSubmitted) return;
    setSelectedLanguage(value);
  };

  const getCurrentLanguage = () => {
    return getLanguageByName(selectedLanguage);
  };

  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      setSubmitResults(null);
      
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
            passed: result.passed,
            input: result.input,
            output: result.output,
            expectedOutput: result.expectedOutput,
            errorMessage: result.errorMessage
          })) : []
        };
        
        setRunResults(formattedResults);
      } else {
        setRunResults({
          error: data.error || 'An error occurred while running your code.',
          testCases: []
        });
      }
    } catch (error) {
      setRunResults({
        error: 'Network error. Please try again.',
        testCases: []
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    const userId = user?.id;
    
    if (!userId) {
      setSubmitResults({
        error: 'You must be logged in to submit. Please refresh the page and try again.',
        testCases: []
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (!code || code.trim() === '') {
        setSubmitResults({
          error: 'Please write some code before submitting.',
          testCases: []
        });
        return;
      }
      
      const response = await fetch(`/api/challenges/${id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          language: selectedLanguage,
          userId: userId
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        const avgExecTime = data.summary?.avgExecutionTime || 0;
        const avgMemSpace = data.summary?.avgMemorySpace || 0;
        
        const formattedResults = {
          runtime: `${avgExecTime.toFixed(2)}ms`,
          memory: `${(avgMemSpace / 1024).toFixed(2)} MB`,
          isSubmission: true,
          submission: {
            ...data.submission,
            code: code,
            language: selectedLanguage
          },
          testCases: data.results ? data.results.map((result, index) => ({
            number: index + 1,
            passed: result.passed,
            input: result.input,
            output: result.output,
            expectedOutput: result.expectedOutput,
            errorMessage: result.errorMessage
          })) : []
        };
        
        setSubmitResults(formattedResults);
        setHasSubmitted(true);
        
        const submissionStatus = await checkUserSubmission(id, userId);
        setSubmissionData(submissionStatus.submission);
      } else {
        setSubmitResults({
          error: data.error || 'An error occurred while submitting your code.',
          testCases: []
        });
      }
    } catch (error) {
      setSubmitResults({
        error: 'Network error. Please try again.',
        testCases: []
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentLanguage = getCurrentLanguage();
  
  let displayResults = null;
  if (submitResults) {
    displayResults = submitResults;
  } else if (runResults) {
    displayResults = runResults;
  } else if (hasSubmitted && submissionData) {
    displayResults = {
      runtime: `${submissionData.summary.avgExecutionTime.toFixed(2)}ms`,
      memory: `${(submissionData.summary.avgMemorySpace / 1024).toFixed(2)} MB`,
      isSubmission: true,
      submission: submissionData,
      testCases: submissionData.testResults || []
    };
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f1729] text-white">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col w-full h-screen bg-[#0f1729] text-white font-mono">
      <div className="flex flex-row h-full">
        <div className="w-1/3 bg-[#0f1729] p-6 overflow-y-auto max-h-screen">
          {problemData ? <ProblemStatement {...problemData} /> : <div className="text-slate-400">Loading problem...</div>}
        </div>

        <div className="flex-1 flex flex-col h-full overflow-hidden mr-6">
          <PanelGroup direction="vertical" className="h-full">
            <div className="bg-[#1f2937] rounded-t-lg px-2 pt-2 mt-6 flex items-center border-b border-slate-700">
              <div className="ml-3 pb-2">
                <Dropdown
                  options={languageOptions}
                  label=""
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="w-48"
                  color="dark-blue-dropdown"
                  disabled={hasSubmitted}
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
                      fontSize: 14,
                      readOnly: false
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
                      disabled={isRunning || isSubmitting}
                      className={`flex items-center gap-1 ${(isRunning || isSubmitting) ? 'bg-slate-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white px-3 py-1 text-sm rounded transition`}
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
                      disabled={isSubmitting || isRunning || hasSubmitted}
                      className={`flex items-center gap-1 ${(isSubmitting || isRunning || hasSubmitted) ? 'bg-slate-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white px-3 py-1 text-sm rounded transition`}
                      title={hasSubmitted ? "You have already submitted for this challenge" : ""}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin">⟳</span> Submitting...
                        </>
                      ) : hasSubmitted ? (
                        <>
                          <span>✅</span> Already Submitted
                        </>
                      ) : (
                        <>
                          <span>↗</span> Submit
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <CodeOutput {...displayResults} />
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}