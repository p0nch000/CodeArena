const { v4: uuidv4 } = require('uuid');

module.exports = async function seedChallenges(prisma) {
  // Find an admin user to be the creator
  const adminUser = await prisma.users.findFirst({
    where: { user_role: 'admin' }
  });
  
  const creatorId = adminUser?.id_user;

  const challenges = [
    // Easy Challenges
    {
      id_challenge: uuidv4(),
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
      difficulty: 'Easy',
      published: true,
      runtime: 100.50,
      memory: 50.25,
      examples: 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].',
      constraints: '2 <= nums.length <= 104\n-109 <= nums[i] <= 109\n-109 <= target <= 109\nOnly one valid answer exists.',
      created_by: creatorId,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    {
      id_challenge: uuidv4(),
      title: 'Valid Parentheses',
      description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.',
      difficulty: 'Easy',
      published: true,
      runtime: 90.20,
      memory: 40.10,
      examples: 'Input: s = "()"\nOutput: true\n\nInput: s = "()[]{}"\nOutput: true\n\nInput: s = "(]"\nOutput: false',
      constraints: '1 <= s.length <= 104\ns consists of parentheses only \'()[]{}\'.', 
      created_by: creatorId,
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    },
    {
      id_challenge: uuidv4(),
      title: 'Merge Two Sorted Lists',
      description: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.',
      difficulty: 'Easy',
      published: true,
      runtime: 110.30,
      memory: 45.80,
      examples: 'Input: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]',
      constraints: 'The number of nodes in both lists is in the range [0, 50].\n-100 <= Node.val <= 100\nBoth list1 and list2 are sorted in non-decreasing order.',
      created_by: creatorId,
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    },
    
    // Medium Challenges
    {
      id_challenge: uuidv4(),
      title: 'Reverse Linked List',
      description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
      difficulty: 'Medium',
      published: true,
      runtime: 120.75,
      memory: 85.30,
      examples: 'Input: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]',
      constraints: 'The number of nodes in the list is the range [0, 5000].\n-5000 <= Node.val <= 5000',
      created_by: creatorId,
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    },
    {
      id_challenge: uuidv4(),
      title: 'Add Two Numbers',
      description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.',
      difficulty: 'Medium',
      published: true,
      runtime: 150.60,
      memory: 95.40,
      examples: 'Input: l1 = [2,4,3], l2 = [5,6,4]\nOutput: [7,0,8]\nExplanation: 342 + 465 = 807',
      constraints: 'The number of nodes in each linked list is in the range [1, 100].\n0 <= Node.val <= 9\nIt is guaranteed that the list represents a number that does not have leading zeros.',
      created_by: creatorId,
      deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
    },
    {
      id_challenge: uuidv4(),
      title: 'Longest Substring Without Repeating Characters',
      description: 'Given a string s, find the length of the longest substring without repeating characters.',
      difficulty: 'Medium',
      published: true,
      runtime: 130.90,
      memory: 90.20,
      examples: 'Input: s = "abcabcbb"\nOutput: 3\nExplanation: The answer is "abc", with the length of 3.',
      constraints: '0 <= s.length <= 5 * 104\ns consists of English letters, digits, symbols and spaces.',
      created_by: creatorId,
      deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), // 22 days from now
    },
    
    // Hard Challenges
    {
      id_challenge: uuidv4(),
      title: 'Median of Two Sorted Arrays',
      description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, find the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
      difficulty: 'Hard',
      published: true,
      runtime: 200.10,
      memory: 120.50,
      examples: 'Input: nums1 = [1,3], nums2 = [2]\nOutput: 2.00000\nExplanation: merged array = [1,2,3] and median is 2.',
      constraints: 'nums1.length == m\nnums2.length == n\n0 <= m <= 1000\n0 <= n <= 1000\n1 <= m + n <= 2000\n-106 <= nums1[i], nums2[i] <= 106',
      created_by: creatorId,
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
    },
    {
      id_challenge: uuidv4(),
      title: 'Regular Expression Matching',
      description: 'Given an input string s and a pattern p, implement regular expression matching with support for \'.\' and \'*\' where \'.\' matches any single character and \'*\' matches zero or more of the preceding element.',
      difficulty: 'Hard',
      published: true,
      runtime: 250.30,
      memory: 150.70,
      examples: 'Input: s = "aa", p = "a"\nOutput: false\nExplanation: "a" does not match the entire string "aa".\n\nInput: s = "aa", p = "a*"\nOutput: true\nExplanation: \'*\' means zero or more of the preceding element, \'a\'. Therefore, by repeating \'a\' once, it becomes "aa".',
      constraints: '1 <= s.length <= 20\n1 <= p.length <= 30\ns contains only lowercase English letters.\np contains only lowercase English letters, \'.\', and \'*\'.\nIt is guaranteed for each appearance of the character \'*\', there will be a previous valid character to match.',
      created_by: creatorId,
      deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000), // 40 days from now
    }
  ];

  // Create challenges in database
  for (const challenge of challenges) {
    await prisma.challenges.upsert({
      where: { id_challenge: challenge.id_challenge },
      update: {},
      create: challenge,
    });
  }

  console.log(`${challenges.length} Challenges seeded`);
};
