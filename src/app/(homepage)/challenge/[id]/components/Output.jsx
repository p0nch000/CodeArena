export default function CodeOutput({ runtime, memory, testCases }) {
    return (
      <div className=" flex flex-col">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
            <span>Runtime: {runtime}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-2 bg-gray-400"></span>
            <span>Memory: {memory}</span>
          </div>
        </div>
        
        <div className="bg-zinc-900 p-3 rounded text-sm font-mono flex-1 overflow-auto">
          {testCases.map((test, idx) => (
            <div key={idx} className="mb-2">
              <div className={test.passed ? 'text-green-400' : 'text-red-400'}>
                [{test.passed ? '+' : '-'}] Test Case {test.number}: {test.passed ? 'Passed' : 'Failed'}
              </div>
              <div>Input: {test.input}</div>
              <div>Output: {test.output}</div>
              {test.expected && test.output !== test.expected && (
                <div className="text-red-400">Expected: {test.expected}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }