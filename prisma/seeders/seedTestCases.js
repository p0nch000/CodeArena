const { v4: uuidv4 } = require('uuid');

module.exports = async function seedTestCases(prisma) {
  const challenges = await prisma.challenges.findMany();
  
  // Define test cases for each challenge
  const testCaseMap = {
    'Two Sum': [
      {
        user_input: '[2,7,11,15], 9',
        expected_output: '[0,1]',
        is_hidden: false
      },
      {
        user_input: '[3,2,4], 6',
        expected_output: '[1,2]',
        is_hidden: false
      },
      {
        user_input: '[3,3], 6',
        expected_output: '[0,1]',
        is_hidden: false
      },
      {
        user_input: '[1,5,8,10,14,19], 24',
        expected_output: '[2,5]',
        is_hidden: true
      }
    ],
    'Valid Parentheses': [
      {
        user_input: '()',
        expected_output: 'true',
        is_hidden: false
      },
      {
        user_input: '()[]{}',
        expected_output: 'true',
        is_hidden: false
      },
      {
        user_input: '(]',
        expected_output: 'false',
        is_hidden: false
      },
      {
        user_input: '([)]',
        expected_output: 'false',
        is_hidden: true
      },
      {
        user_input: '{[]}',
        expected_output: 'true',
        is_hidden: true
      }
    ],
    'Merge Two Sorted Lists': [
      {
        user_input: '[1,2,4], [1,3,4]',
        expected_output: '[1,1,2,3,4,4]',
        is_hidden: false
      },
      {
        user_input: '[], []',
        expected_output: '[]',
        is_hidden: false
      },
      {
        user_input: '[], [0]',
        expected_output: '[0]',
        is_hidden: false
      },
      {
        user_input: '[1,3,5,7], [2,4,6]',
        expected_output: '[1,2,3,4,5,6,7]',
        is_hidden: true
      }
    ],
    'Reverse Linked List': [
      {
        user_input: '[1,2,3,4,5]',
        expected_output: '[5,4,3,2,1]',
        is_hidden: false
      },
      {
        user_input: '[1,2]',
        expected_output: '[2,1]',
        is_hidden: false
      },
      {
        user_input: '[]',
        expected_output: '[]',
        is_hidden: false
      },
      {
        user_input: '[1,2,3,4,5,6,7,8]',
        expected_output: '[8,7,6,5,4,3,2,1]',
        is_hidden: true
      }
    ],
    'Add Two Numbers': [
      {
        user_input: '[2,4,3], [5,6,4]',
        expected_output: '[7,0,8]',
        is_hidden: false
      },
      {
        user_input: '[0], [0]',
        expected_output: '[0]',
        is_hidden: false
      },
      {
        user_input: '[9,9,9,9], [9,9,9]',
        expected_output: '[8,9,9,0,1]',
        is_hidden: false
      },
      {
        user_input: '[2,4,8], [1,9,5]',
        expected_output: '[3,3,4,1]',
        is_hidden: true
      }
    ],
    'Longest Substring Without Repeating Characters': [
      {
        user_input: 'abcabcbb',
        expected_output: '3',
        is_hidden: false
      },
      {
        user_input: 'bbbbb',
        expected_output: '1',
        is_hidden: false
      },
      {
        user_input: 'pwwkew',
        expected_output: '3',
        is_hidden: false
      },
      {
        user_input: 'aab',
        expected_output: '2',
        is_hidden: true
      },
      {
        user_input: 'dvdf',
        expected_output: '3',
        is_hidden: true
      }
    ],
    'Median of Two Sorted Arrays': [
      {
        user_input: '[1,3], [2]',
        expected_output: '2.0',
        is_hidden: false
      },
      {
        user_input: '[1,2], [3,4]',
        expected_output: '2.5',
        is_hidden: false
      },
      {
        user_input: '[0,0], [0,0]',
        expected_output: '0.0',
        is_hidden: false
      },
      {
        user_input: '[], [1]',
        expected_output: '1.0',
        is_hidden: true
      },
      {
        user_input: '[2,3,4,5,6], [1]',
        expected_output: '3.5',
        is_hidden: true
      }
    ],
    'Regular Expression Matching': [
      {
        user_input: 'aa, a',
        expected_output: 'false',
        is_hidden: false
      },
      {
        user_input: 'aa, a*',
        expected_output: 'true',
        is_hidden: false
      },
      {
        user_input: 'ab, .*',
        expected_output: 'true',
        is_hidden: false
      },
      {
        user_input: 'aab, c*a*b',
        expected_output: 'true',
        is_hidden: true
      },
      {
        user_input: 'mississippi, mis*is*p*.',
        expected_output: 'false',
        is_hidden: true
      }
    ]
  };
  
  // Default test cases for challenges that don't have specific test cases defined
  const defaultTestCases = [
    {
      user_input: 'sample input 1',
      expected_output: 'sample output 1',
      is_hidden: false
    },
    {
      user_input: 'sample input 2',
      expected_output: 'sample output 2',
      is_hidden: false
    },
    {
      user_input: 'sample input 3',
      expected_output: 'sample output 3',
      is_hidden: true
    }
  ];

  let totalTestCases = 0;

  for (const challenge of challenges) {
    // Get test cases for this challenge or use default test cases
    const testCases = testCaseMap[challenge.title] || defaultTestCases;
    
    for (const testCase of testCases) {
      await prisma.test_cases.create({
        data: {
          id_test: uuidv4(),
          user_input: testCase.user_input,
          expected_output: testCase.expected_output,
          is_hidden: testCase.is_hidden,
          id_challenge: challenge.id_challenge,
        },
      });
      totalTestCases++;
    }
  }

  console.log(`${totalTestCases} Test Cases seeded`);
};
