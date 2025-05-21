export default function CodeOutput({ runtime, memory, testCases, error }) {
  if (error) {
    return (
      <div className="bg-rose-900/30 border border-rose-700 p-4 rounded-lg shadow-md">
        <h3 className="text-rose-300 font-semibold mb-2 text-lg">Execution Error</h3>
        <pre className="text-rose-200 whitespace-pre-wrap text-sm bg-slate-800 p-3 rounded-md">{error}</pre>
      </div>
    );
  }

  if (!testCases || testCases.length === 0) {
    return (
      <div className="text-slate-500 italic p-4 text-center">
        Run your code or submit a solution to see the results here.
      </div>
    );
  }

  const passedCount = testCases.filter(tc => tc.passed).length;
  const totalCount = testCases.length;
  const allPassed = passedCount === totalCount;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm p-3 bg-slate-700/50 rounded-lg shadow">
        <div className="flex space-x-6 mb-2 sm:mb-0">
          <div>
            <span className="text-slate-400">Runtime:</span> <span className="text-slate-200 font-medium">{runtime}</span>
          </div>
          <div>
            <span className="text-slate-400">Memory:</span> <span className="text-slate-200 font-medium">{memory}</span>
          </div>
        </div>
        <div className={`font-semibold ${allPassed ? "text-emerald-400" : "text-rose-400"}`}>
          {passedCount}/{totalCount} test cases passed
        </div>
      </div>

      <div className="space-y-4">
        {testCases.map((testCase) => (
          <div 
            key={testCase.number} 
            className={`p-4 rounded-lg shadow-md border ${testCase.passed ? 'bg-emerald-600/10 border-emerald-500/30' : 'bg-rose-600/10 border-rose-500/30'}`}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold text-slate-200">
                Test Case {testCase.number}
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${testCase.passed ? 'bg-emerald-500/80 text-emerald-50' : 'bg-rose-500/80 text-rose-50'}`}>
                {testCase.passed ? "PASSED" : "FAILED"}
              </span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-slate-400 mb-1 font-medium">Input:</div>
                <pre className="bg-slate-800 p-3 rounded text-slate-300 whitespace-pre-wrap">{testCase.input}</pre>
              </div>
              
              <div>
                <div className="text-slate-400 mb-1 font-medium">Expected Output:</div>
                <pre className="bg-slate-800 p-3 rounded text-slate-300 whitespace-pre-wrap">{testCase.expectedOutput}</pre>
              </div>
              
              {!testCase.passed && testCase.output !== undefined && (
                <div>
                  <div className="text-slate-400 mb-1 font-medium">Your Output:</div>
                  <pre className="bg-slate-800 p-3 rounded text-rose-300 whitespace-pre-wrap">{testCase.output || "No output"}</pre>
                </div>
              )}
              
              {testCase.errorMessage && (
                <div>
                  <div className="text-rose-400 mb-1 font-medium">Error Message:</div>
                  <pre className="bg-slate-800 p-3 rounded whitespace-pre-wrap text-rose-300">{testCase.errorMessage}</pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}