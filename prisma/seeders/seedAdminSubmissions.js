const { v4: uuidv4 } = require('uuid');

module.exports = async function seedAdminSubmissions(prisma) {
  // Find the admin user
  const adminUser = await prisma.users.findFirst({
    where: { username: 'admin' }
  });

  if (!adminUser) {
    console.log('Admin user not found, skipping admin submissions seeding');
    return;
  }

  // Get all challenges
  const challenges = await prisma.challenges.findMany();
  
  // Sample code solutions for different programming languages
  const programmingLanguages = ['JavaScript', 'Python', 'Java', 'C++', 'Go'];
  
  // Sample solutions templates for different languages
  const languageSolutions = {
    'JavaScript': (challenge) => `// ${challenge.title} solution in JavaScript
function solution(input) {
  // Optimized implementation
  console.log("Processing input:", input);
  
  // Solution logic here
  const result = "Correctly processed result";
  
  return result;
}`,
    'Python': (challenge) => `# ${challenge.title} solution in Python
def solution(input):
    # Optimized implementation
    print("Processing input:", input)
    
    # Solution logic here
    result = "Correctly processed result"
    
    return result`,
    'Java': (challenge) => `// ${challenge.title} solution in Java
public class Solution {
    public static String solution(String input) {
        // Optimized implementation
        System.out.println("Processing input: " + input);
        
        // Solution logic here
        String result = "Correctly processed result";
        
        return result;
    }
}`,
    'C++': (challenge) => `// ${challenge.title} solution in C++
#include <iostream>
#include <string>

std::string solution(std::string input) {
    // Optimized implementation
    std::cout << "Processing input: " << input << std::endl;
    
    // Solution logic here
    std::string result = "Correctly processed result";
    
    return result;
}`,
    'Go': (challenge) => `// ${challenge.title} solution in Go
package main

import "fmt"

func solution(input string) string {
    // Optimized implementation
    fmt.Println("Processing input:", input)
    
    // Solution logic here
    result := "Correctly processed result"
    
    return result
}`
  };

  // Statuses to use (mostly accepted solutions for admin)
  const statuses = ['Accepted', 'Accepted', 'Accepted', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded'];
  
  let adminSubmissionsCreated = 0;
  const totalAdminSubmissions = 100; // Creating many submissions for admin
  
  // Create a submission for each challenge and each programming language for admin
  for (const challenge of challenges) {
    for (const language of programmingLanguages) {
      // Create multiple submissions for each language/challenge combination
      const submissionsPerCombo = Math.ceil(totalAdminSubmissions / (challenges.length * programmingLanguages.length));
      
      for (let i = 0; i < submissionsPerCombo; i++) {
        if (adminSubmissionsCreated >= totalAdminSubmissions) break;
        
        // Determine status (80% chance for accepted)
        const statusIndex = Math.random() < 0.8 ? 0 : Math.floor(Math.random() * statuses.length);
        const status = statuses[statusIndex];
        
        // Get solution code for this language
        let code = languageSolutions[language](challenge);
        
        // For non-accepted submissions, introduce some "bugs"
        if (status !== 'Accepted') {
          // Randomly introduce "bugs" to the code
          const bugTypes = ['syntax', 'logic', 'performance'];
          const bugType = bugTypes[Math.floor(Math.random() * bugTypes.length)];
          
          switch (bugType) {
            case 'syntax':
              // Add a syntax error
              code = code.replace('{', '').replace('(', '[');
              break;
            case 'logic':
              // Change a logical operator or value
              code = code.replace('Correctly', 'Incorrectly');
              break;
            case 'performance':
              // Make inefficient (for "Time Limit Exceeded")
              code = code.replace('Optimized', 'Extremely inefficient');
              break;
          }
        }
        
        // Calculate runtime (ms) and memory (KB) based on status
        let runtime;
        let memory;
        if (status === 'Accepted') {
          runtime = Math.floor(Math.random() * 300); // 0-300ms (faster than average)
          memory = Math.floor(Math.random() * 3000) + 3000; // 3000-6000 KB (more efficient)
        } else if (status === 'Time Limit Exceeded') {
          runtime = Math.floor(Math.random() * 1000) + 2000; // 2000-3000ms (too slow)
          memory = Math.floor(Math.random() * 10000) + 5000; // 5000-15000 KB
        } else {
          runtime = Math.floor(Math.random() * 1000);
          memory = Math.floor(Math.random() * 8000) + 2000;
        }
        
        // Create submission with a random date in the past 2 months
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 60));
        
        await prisma.submissions.create({
          data: {
            id_submission: uuidv4(),
            final_code: code,
            is_correct: status === 'Accepted',
            programming_language: language,
            status: status,
            final_execution_time: runtime,
            final_memory_space: memory,
            submitted_at: pastDate,
            id_challenge: challenge.id_challenge,
            id_user: adminUser.id_user,
          },
        });
        
        adminSubmissionsCreated++;
      }
    }
  }

  console.log(`${adminSubmissionsCreated} Admin Submissions seeded`);
}; 