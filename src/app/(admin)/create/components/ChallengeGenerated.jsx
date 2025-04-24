export default function ChallengeGenerated({}) {
  return (
      <div className="bg-mahindra-dark-blue rounded-lg p-6 shadow-lg relative font-mono">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-mono text-mahindra-white">Two Sum</h2>
          <button className="text-gray-400 hover:text-white rounded-full p-2 transition-colors">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-7M16.5 3.5a2.121 2.121 0 1 1 3 3L12 14l-4 1 1-4 7.5-7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-400 mb-6 font-mono">
          Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
        </p>
        
        <div className="mb-6">
          <h3 className="font-mono mb-2 text-mahindra-white">Example 1:</h3>
          <div className="bg-gray-900 p-4 rounded-md font-mono text-mahindra-light-gray">
            <p>Input: nums = [2,7,11,15], target = 9</p>
            <p>Output: [0,1]</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-mono mb-2 text-mahindra-white">Constraints:</h3>
          <ul className="bg-gray-900 p-4 rounded-md font-mono text-mahindra-light-gray">
            <li>2 ≤ nums.length ≤ 104</li>
            <li>-109 ≤ nums[i] ≤ 109</li>
            <li>-109 ≤ target ≤ 109</li>
          </ul>
        </div>
      </div>
  );
};