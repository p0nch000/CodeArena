'use client';

import { useState } from 'react';

export default function SubmissionInfo({ submission }) {
  const [showCode, setShowCode] = useState(false);
  const [showTestCases, setShowTestCases] = useState(false);

  if (!submission) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'text-green-400';
      case 'WRONG_ANSWER':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return '✅';
      case 'WRONG_ANSWER':
        return '❌';
      default:
        return '⚠️';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 mb-4 border border-slate-600">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          {getStatusIcon(submission.status)} Your Submission
        </h3>
        <span className={`text-sm font-medium ${getStatusColor(submission.status)}`}>
          {submission.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-slate-400">Language:</span>
          <span className="text-white ml-2">{submission.language}</span>
        </div>
        <div>
          <span className="text-slate-400">Submitted:</span>
          <span className="text-white ml-2">{formatDate(submission.submittedAt)}</span>
        </div>
        <div>
          <span className="text-slate-400">Tests Passed:</span>
          <span className="text-white ml-2">
            {submission.summary.passedTests}/{submission.summary.totalTests}
          </span>
        </div>
        <div>
          <span className="text-slate-400">Execution Time:</span>
          <span className="text-white ml-2">{submission.summary.avgExecutionTime.toFixed(2)}ms</span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowCode(!showCode)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded transition"
        >
          {showCode ? 'Hide Code' : 'Show Code'}
        </button>
        <button
          onClick={() => setShowTestCases(!showTestCases)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-sm rounded transition"
        >
          {showTestCases ? 'Hide Test Results' : 'Show Test Results'}
        </button>
      </div>

      {showCode && (
        <div className="mb-4">
          <h4 className="text-white font-medium mb-2">Your Code:</h4>
          <pre className="bg-slate-900 p-3 rounded text-sm text-slate-300 overflow-x-auto border border-slate-700">
            <code>{submission.code}</code>
          </pre>
        </div>
      )}

      {showTestCases && (
        <div>
          <h4 className="text-white font-medium mb-2">Test Results:</h4>
          <div className="space-y-2">
            {submission.testResults.map((test, index) => (
              <div
                key={index}
                className={`p-3 rounded border ${
                  test.passed
                    ? 'bg-green-900/20 border-green-600'
                    : 'bg-red-900/20 border-red-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">
                    Test Case {test.number}
                  </span>
                  <span className={test.passed ? 'text-green-400' : 'text-red-400'}>
                    {test.passed ? '✅ Passed' : '❌ Failed'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-slate-400">Input:</span>
                    <pre className="text-slate-300 mt-1 bg-slate-800 p-2 rounded text-xs">
                      {test.input || 'No input'}
                    </pre>
                  </div>
                  <div>
                    <span className="text-slate-400">Your Output:</span>
                    <pre className="text-slate-300 mt-1 bg-slate-800 p-2 rounded text-xs">
                      {test.output || 'No output'}
                    </pre>
                  </div>
                  <div>
                    <span className="text-slate-400">Expected:</span>
                    <pre className="text-slate-300 mt-1 bg-slate-800 p-2 rounded text-xs">
                      {test.expectedOutput}
                    </pre>
                  </div>
                </div>

                {test.errorMessage && (
                  <div className="mt-2">
                    <span className="text-red-400 text-sm">Error:</span>
                    <pre className="text-red-300 mt-1 bg-red-900/20 p-2 rounded text-xs">
                      {test.errorMessage}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 