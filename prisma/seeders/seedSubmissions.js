const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');

module.exports = async function seedSubmissions(prisma) {
  const users = await prisma.users.findMany();
  const challenges = await prisma.challenges.findMany();
  
  // Submission status options
  const statuses = ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'];
  
  // Sample code solutions for different challenges
  const sampleSolutions = {
    'Two Sum': [
      `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      `function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}`
    ],
    'Valid Parentheses': [
      `function isValid(s) {
  const stack = [];
  const map = {
    '(': ')',
    '[': ']',
    '{': '}'
  };
  
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(' || s[i] === '[' || s[i] === '{') {
      stack.push(s[i]);
    } else {
      const last = stack.pop();
      if (map[last] !== s[i]) {
        return false;
      }
    }
  }
  
  return stack.length === 0;
}`
    ],
    'Merge Two Sorted Lists': [
      `function mergeTwoLists(l1, l2) {
  if (!l1) return l2;
  if (!l2) return l1;
  
  if (l1.val < l2.val) {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
  }
}`
    ]
  };
  
  // Default code solution for challenges without specific solutions
  const defaultSolution = `function solution(input) {
  // Implementation logic here
  return "output";
}`;

  let submissionsCreated = 0;
  const totalSubmissions = 200; // Creating a large number of submissions

  // Create submissions for each challenge from different users
  while (submissionsCreated < totalSubmissions) {
    const user = users[Math.floor(Math.random() * users.length)];
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    
    // Determine if this will be an accepted submission (60% chance)
    const statusIndex = Math.random() < 0.6 ? 0 : Math.floor(Math.random() * statuses.length);
    const status = statuses[statusIndex];
    
    // Get solution code - either from samples or default
    let code;
    if (sampleSolutions[challenge.title] && sampleSolutions[challenge.title].length > 0) {
      const solutionIndex = Math.floor(Math.random() * sampleSolutions[challenge.title].length);
      code = sampleSolutions[challenge.title][solutionIndex];
    } else {
      code = defaultSolution;
    }
    
    // For non-accepted submissions, introduce some "bugs"
    if (status !== 'Accepted') {
      // Randomly introduce "bugs" to the code
      const bugTypes = ['syntax', 'logic', 'performance'];
      const bugType = bugTypes[Math.floor(Math.random() * bugTypes.length)];
      
      switch (bugType) {
        case 'syntax':
          // Add a syntax error (missing bracket, semicolon, etc.)
          if (Math.random() < 0.5) {
            code = code.replace('}', '');
          } else {
            code = code.replace('(', '');
          }
          break;
        case 'logic':
          // Change a logical operator or value
          code = code.replace('===', '==').replace('!==', '!=');
          break;
        case 'performance':
          // Make inefficient (for "Time Limit Exceeded")
          if (code.includes('Map')) {
            code = code.replace('Map', 'Object');
          }
          break;
      }
    }
    
    // Calculate runtime (ms) and memory (KB) based on status
    let runtime;
    let memory;
    if (status === 'Accepted') {
      runtime = Math.floor(Math.random() * 500); // 0-500ms
      memory = Math.floor(Math.random() * 5000) + 5000; // 5000-10000 KB
    } else if (status === 'Time Limit Exceeded') {
      runtime = Math.floor(Math.random() * 1000) + 2000; // 2000-3000ms (too slow)
      memory = Math.floor(Math.random() * 10000) + 5000; // 5000-15000 KB
    } else {
      runtime = Math.floor(Math.random() * 1000);
      memory = Math.floor(Math.random() * 10000);
    }
    
    // Calculate score based on status and runtime
    let score = 0;
    if (status === 'Accepted') {
      // Score calculation: base score + performance bonus
      // Base score depends on difficulty
      let baseScore;
      switch (challenge.difficulty) {
        case 'Easy':
          baseScore = 100;
          break;
        case 'Medium':
          baseScore = 250;
          break;
        case 'Hard':
          baseScore = 500;
          break;
        default:
          baseScore = 100;
      }
      
      // Performance bonus: faster solutions get higher scores
      const performanceMultiplier = 1 - (runtime / 1000); // 0-1 multiplier
      score = Math.floor(baseScore * (1 + performanceMultiplier));
    }
    
    // Create submission with a random date in the past month
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 30));
    
    await prisma.submissions.create({
      data: {
        id_submission: uuidv4(),
        final_code: code,
        is_correct: status === 'Accepted',
        programming_language: 'JavaScript',
        status: status,
        final_execution_time: runtime,
        final_memory_space: memory,
        submitted_at: pastDate,
        id_challenge: challenge.id_challenge,
        id_user: user.id_user,
      },
    });
    
    submissionsCreated++;
  }

  console.log(`${submissionsCreated} Submissions seeded`);
};
