'use client';

import { useState } from 'react';

export default function CodeOutput({ 
  runtime, 
  memory, 
  testCases = [], 
  error, 
  isSubmission = false,
  submission = null 
}) {
  const [activeTab, setActiveTab] = useState('results');

  if (isSubmission && submission) {
    return (
      <div className="bg-[#1f2937] rounded-lg p-4 h-full">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-600">
          <div className="flex items-center gap-3">
            <div className={`text-2xl ${submission.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {submission.isCorrect ? '✅' : '❌'}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Submission {submission.isCorrect ? 'Accepted' : 'Failed'}
              </h3>
              <p className="text-sm text-slate-400">
                Submitted on {new Date(submission.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded text-sm font-medium ${
            submission.isCorrect 
              ? 'bg-green-900/30 text-green-400 border border-green-600' 
              : 'bg-red-900/30 text-red-400 border border-red-600'
          }`}>
            {submission.status}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-slate-800 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-white">{runtime}</div>
            <div className="text-xs text-slate-400">Runtime</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-white">{memory}</div>
            <div className="text-xs text-slate-400">Memory</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-white">
              {testCases.filter(t => t.passed).length}/{testCases.length}
            </div>
            <div className="text-xs text-slate-400">Test Cases</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 text-center">
            <div className={`text-lg font-semibold ${submission.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {submission.isCorrect ? '100%' : Math.round((testCases.filter(t => t.passed).length / testCases.length) * 100) + '%'}
            </div>
            <div className="text-xs text-slate-400">Success Rate</div>
          </div>
        </div>

        <div className="flex space-x-1 mb-4">
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 text-sm rounded-t-lg transition ${
              activeTab === 'results'
                ? 'bg-slate-700 text-white border-b-2 border-blue-500'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Test Results
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 text-sm rounded-t-lg transition ${
              activeTab === 'code'
                ? 'bg-slate-700 text-white border-b-2 border-blue-500'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Submitted Code
          </button>
        </div>

        <div className="bg-slate-800 rounded-lg p-4 max-h-96 overflow-y-auto">
          {activeTab === 'results' && (
            <div className="space-y-3">
              {testCases.length > 0 ? (
                testCases.map((testCase, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      testCase.passed
                        ? 'bg-green-900/20 border-green-500'
                        : 'bg-red-900/20 border-red-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-white">
                        Test Case {testCase.number}
                      </span>
                      <span className={`text-sm font-medium ${
                        testCase.passed ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {testCase.passed ? '✅ Passed' : '❌ Failed'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <div className="text-slate-400 mb-1">Input:</div>
                        <pre className="bg-slate-900 p-2 rounded text-slate-300 text-xs overflow-x-auto">
                          {testCase.input || 'No input'}
                        </pre>
                      </div>
                      <div>
                        <div className="text-slate-400 mb-1">Your Output:</div>
                        <pre className="bg-slate-900 p-2 rounded text-slate-300 text-xs overflow-x-auto">
                          {testCase.output || 'No output'}
                        </pre>
                      </div>
                      <div>
                        <div className="text-slate-400 mb-1">Expected:</div>
                        <pre className="bg-slate-900 p-2 rounded text-slate-300 text-xs overflow-x-auto">
                          {testCase.expectedOutput}
                        </pre>
                      </div>
                    </div>

                    {testCase.errorMessage && (
                      <div className="mt-3">
                        <div className="text-red-400 text-sm mb-1">Error:</div>
                        <pre className="bg-red-900/20 p-2 rounded text-red-300 text-xs overflow-x-auto">
                          {testCase.errorMessage}
                        </pre>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 py-8">
                  No test case results available
                </div>
              )}
            </div>
          )}

          {activeTab === 'code' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">Your Submitted Code</h4>
                <span className="text-sm text-slate-400">
                  Language: {submission.language || 'Unknown'}
                </span>
              </div>
              <pre className="bg-slate-900 p-4 rounded text-sm text-slate-300 overflow-x-auto border border-slate-700">
                <code>{submission.code || 'No code available'}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1f2937] rounded-lg p-4 h-full">
      {error ? (
        <div className="text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-600">
          <div className="font-medium mb-2">❌ Error</div>
          <pre className="text-sm whitespace-pre-wrap">{error}</pre>
        </div>
      ) : (
        <>
          {(runtime || memory) && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-white">{runtime || 'N/A'}</div>
                <div className="text-xs text-slate-400">Runtime</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-white">{memory || 'N/A'}</div>
                <div className="text-xs text-slate-400">Memory</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <div className="text-lg font-semibold text-white">
                  {testCases.filter(t => t.passed).length}/{testCases.length}
                </div>
                <div className="text-xs text-slate-400">Test Cases</div>
              </div>
            </div>
          )}

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {testCases.length > 0 ? (
              testCases.map((testCase, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    testCase.passed
                      ? 'bg-green-900/20 border-green-500'
                      : 'bg-red-900/20 border-red-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-white">
                      Test Case {testCase.number}
                    </span>
                    <span className={`text-sm font-medium ${
                      testCase.passed ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {testCase.passed ? '✅ Passed' : '❌ Failed'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <div className="text-slate-400 mb-1">Input:</div>
                      <pre className="bg-slate-900 p-2 rounded text-slate-300 text-xs overflow-x-auto">
                        {testCase.input || 'No input'}
                      </pre>
                    </div>
                    <div>
                      <div className="text-slate-400 mb-1">Your Output:</div>
                      <pre className="bg-slate-900 p-2 rounded text-slate-300 text-xs overflow-x-auto">
                        {testCase.output || 'No output'}
                      </pre>
                    </div>
                    <div>
                      <div className="text-slate-400 mb-1">Expected:</div>
                      <pre className="bg-slate-900 p-2 rounded text-slate-300 text-xs overflow-x-auto">
                        {testCase.expectedOutput}
                      </pre>
                    </div>
                  </div>

                  {testCase.errorMessage && (
                    <div className="mt-3">
                      <div className="text-red-400 text-sm mb-1">Error:</div>
                      <pre className="bg-red-900/20 p-2 rounded text-red-300 text-xs overflow-x-auto">
                        {testCase.errorMessage}
                      </pre>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-slate-400 py-8">
                Click "Run Code" to see test results
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}