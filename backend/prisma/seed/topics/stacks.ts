import { CodingProblemSeedInput } from '../types';

export const stackProblems: CodingProblemSeedInput[] = [
  {
    title: 'Valid Parentheses Matching',
    slug: 'valid-parentheses-matching',
    description: `Given an input configuration, solve the Valid Parentheses Matching problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'EASY',
    topic: 'Stack',
    tags: ['stack', 'string'],
    examples: [
      { input: 'Sample Input 1', output: 'Sample Output 1', explanation: 'Primary problem example' }
    ],
    constraints: ['1 <= N <= 10^5'],
    starterCode: {
      java: `class Solution {
    public int solve() {
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int solve() {
        return 0;
    }
};`,
      python: `class Solution:
    def solve(self) -> int:
        return 0`,
      javascript: `function solve() {
    return 0;
}`,
      typescript: `function solve(): number {
    return 0;
}`
    },
    visibleTestCases: [
      { input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', explanation: 'Standard visible case 1' },
      { input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[1, 2]', explanation: 'Representative test case 2' },
      { input: 'nums = [3, 3], target = 6', expectedOutput: '[0, 1]', explanation: 'Boundary duplicate elements case 3' },
      { input: 'nums = [-1, -2, -3], target = -5', expectedOutput: '[1, 2]', explanation: 'Negative numbers case 4' }
    ],
    hiddenTestCases: [
      { input: 'nums = [1, 5, 10], target = 6', expectedOutput: '[0, 1]' },
      { input: 'nums = [2, 6, 11], target = 7', expectedOutput: '[0, 1]' },
      { input: 'nums = [3, 7, 12], target = 8', expectedOutput: '[0, 1]' },
      { input: 'nums = [4, 8, 13], target = 9', expectedOutput: '[0, 1]' },
      { input: 'nums = [5, 9, 14], target = 10', expectedOutput: '[0, 1]' },
      { input: 'nums = [6, 10, 15], target = 11', expectedOutput: '[0, 1]' },
      { input: 'nums = [7, 11, 16], target = 12', expectedOutput: '[0, 1]' },
      { input: 'nums = [8, 12, 17], target = 13', expectedOutput: '[0, 1]' },
      { input: 'nums = [9, 13, 18], target = 14', expectedOutput: '[0, 1]' },
      { input: 'nums = [10, 14, 19], target = 15', expectedOutput: '[0, 1]' },
      { input: 'nums = [11, 15, 20], target = 16', expectedOutput: '[0, 1]' },
      { input: 'nums = [12, 16, 21], target = 17', expectedOutput: '[0, 1]' }
    ]
  },
  {
    title: 'Min Stack Constant Time Retrieval',
    slug: 'min-stack-constant-time-retrieval',
    description: `Given an input configuration, solve the Min Stack Constant Time Retrieval problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Stack',
    tags: ['stack', 'design'],
    examples: [
      { input: 'Sample Input 1', output: 'Sample Output 1', explanation: 'Primary problem example' }
    ],
    constraints: ['1 <= N <= 10^5'],
    starterCode: {
      java: `class Solution {
    public int solve() {
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int solve() {
        return 0;
    }
};`,
      python: `class Solution:
    def solve(self) -> int:
        return 0`,
      javascript: `function solve() {
    return 0;
}`,
      typescript: `function solve(): number {
    return 0;
}`
    },
    visibleTestCases: [
      { input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', explanation: 'Standard visible case 1' },
      { input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[1, 2]', explanation: 'Representative test case 2' },
      { input: 'nums = [3, 3], target = 6', expectedOutput: '[0, 1]', explanation: 'Boundary duplicate elements case 3' },
      { input: 'nums = [-1, -2, -3], target = -5', expectedOutput: '[1, 2]', explanation: 'Negative numbers case 4' }
    ],
    hiddenTestCases: [
      { input: 'nums = [1, 5, 10], target = 6', expectedOutput: '[0, 1]' },
      { input: 'nums = [2, 6, 11], target = 7', expectedOutput: '[0, 1]' },
      { input: 'nums = [3, 7, 12], target = 8', expectedOutput: '[0, 1]' },
      { input: 'nums = [4, 8, 13], target = 9', expectedOutput: '[0, 1]' },
      { input: 'nums = [5, 9, 14], target = 10', expectedOutput: '[0, 1]' },
      { input: 'nums = [6, 10, 15], target = 11', expectedOutput: '[0, 1]' },
      { input: 'nums = [7, 11, 16], target = 12', expectedOutput: '[0, 1]' },
      { input: 'nums = [8, 12, 17], target = 13', expectedOutput: '[0, 1]' },
      { input: 'nums = [9, 13, 18], target = 14', expectedOutput: '[0, 1]' },
      { input: 'nums = [10, 14, 19], target = 15', expectedOutput: '[0, 1]' },
      { input: 'nums = [11, 15, 20], target = 16', expectedOutput: '[0, 1]' },
      { input: 'nums = [12, 16, 21], target = 17', expectedOutput: '[0, 1]' }
    ]
  },
  {
    title: 'Evaluate Reverse Polish Notation',
    slug: 'evaluate-reverse-polish-notation',
    description: `Given an input configuration, solve the Evaluate Reverse Polish Notation problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Stack',
    tags: ['stack', 'math'],
    examples: [
      { input: 'Sample Input 1', output: 'Sample Output 1', explanation: 'Primary problem example' }
    ],
    constraints: ['1 <= N <= 10^5'],
    starterCode: {
      java: `class Solution {
    public int solve() {
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int solve() {
        return 0;
    }
};`,
      python: `class Solution:
    def solve(self) -> int:
        return 0`,
      javascript: `function solve() {
    return 0;
}`,
      typescript: `function solve(): number {
    return 0;
}`
    },
    visibleTestCases: [
      { input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', explanation: 'Standard visible case 1' },
      { input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[1, 2]', explanation: 'Representative test case 2' },
      { input: 'nums = [3, 3], target = 6', expectedOutput: '[0, 1]', explanation: 'Boundary duplicate elements case 3' },
      { input: 'nums = [-1, -2, -3], target = -5', expectedOutput: '[1, 2]', explanation: 'Negative numbers case 4' }
    ],
    hiddenTestCases: [
      { input: 'nums = [1, 5, 10], target = 6', expectedOutput: '[0, 1]' },
      { input: 'nums = [2, 6, 11], target = 7', expectedOutput: '[0, 1]' },
      { input: 'nums = [3, 7, 12], target = 8', expectedOutput: '[0, 1]' },
      { input: 'nums = [4, 8, 13], target = 9', expectedOutput: '[0, 1]' },
      { input: 'nums = [5, 9, 14], target = 10', expectedOutput: '[0, 1]' },
      { input: 'nums = [6, 10, 15], target = 11', expectedOutput: '[0, 1]' },
      { input: 'nums = [7, 11, 16], target = 12', expectedOutput: '[0, 1]' },
      { input: 'nums = [8, 12, 17], target = 13', expectedOutput: '[0, 1]' },
      { input: 'nums = [9, 13, 18], target = 14', expectedOutput: '[0, 1]' },
      { input: 'nums = [10, 14, 19], target = 15', expectedOutput: '[0, 1]' },
      { input: 'nums = [11, 15, 20], target = 16', expectedOutput: '[0, 1]' },
      { input: 'nums = [12, 16, 21], target = 17', expectedOutput: '[0, 1]' }
    ]
  },
  {
    title: 'Daily Temperatures Next Warmer Day',
    slug: 'daily-temperatures-next-warmer-day',
    description: `Given an input configuration, solve the Daily Temperatures Next Warmer Day problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Stack',
    tags: ['stack', 'monotonic-stack'],
    examples: [
      { input: 'Sample Input 1', output: 'Sample Output 1', explanation: 'Primary problem example' }
    ],
    constraints: ['1 <= N <= 10^5'],
    starterCode: {
      java: `class Solution {
    public int solve() {
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int solve() {
        return 0;
    }
};`,
      python: `class Solution:
    def solve(self) -> int:
        return 0`,
      javascript: `function solve() {
    return 0;
}`,
      typescript: `function solve(): number {
    return 0;
}`
    },
    visibleTestCases: [
      { input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', explanation: 'Standard visible case 1' },
      { input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[1, 2]', explanation: 'Representative test case 2' },
      { input: 'nums = [3, 3], target = 6', expectedOutput: '[0, 1]', explanation: 'Boundary duplicate elements case 3' },
      { input: 'nums = [-1, -2, -3], target = -5', expectedOutput: '[1, 2]', explanation: 'Negative numbers case 4' }
    ],
    hiddenTestCases: [
      { input: 'nums = [1, 5, 10], target = 6', expectedOutput: '[0, 1]' },
      { input: 'nums = [2, 6, 11], target = 7', expectedOutput: '[0, 1]' },
      { input: 'nums = [3, 7, 12], target = 8', expectedOutput: '[0, 1]' },
      { input: 'nums = [4, 8, 13], target = 9', expectedOutput: '[0, 1]' },
      { input: 'nums = [5, 9, 14], target = 10', expectedOutput: '[0, 1]' },
      { input: 'nums = [6, 10, 15], target = 11', expectedOutput: '[0, 1]' },
      { input: 'nums = [7, 11, 16], target = 12', expectedOutput: '[0, 1]' },
      { input: 'nums = [8, 12, 17], target = 13', expectedOutput: '[0, 1]' },
      { input: 'nums = [9, 13, 18], target = 14', expectedOutput: '[0, 1]' },
      { input: 'nums = [10, 14, 19], target = 15', expectedOutput: '[0, 1]' },
      { input: 'nums = [11, 15, 20], target = 16', expectedOutput: '[0, 1]' },
      { input: 'nums = [12, 16, 21], target = 17', expectedOutput: '[0, 1]' }
    ]
  },
  {
    title: 'Decode String Nested Multipliers',
    slug: 'decode-string-nested-multipliers',
    description: `Given an input configuration, solve the Decode String Nested Multipliers problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Stack',
    tags: ['stack', 'recursion'],
    examples: [
      { input: 'Sample Input 1', output: 'Sample Output 1', explanation: 'Primary problem example' }
    ],
    constraints: ['1 <= N <= 10^5'],
    starterCode: {
      java: `class Solution {
    public int solve() {
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int solve() {
        return 0;
    }
};`,
      python: `class Solution:
    def solve(self) -> int:
        return 0`,
      javascript: `function solve() {
    return 0;
}`,
      typescript: `function solve(): number {
    return 0;
}`
    },
    visibleTestCases: [
      { input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', explanation: 'Standard visible case 1' },
      { input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[1, 2]', explanation: 'Representative test case 2' },
      { input: 'nums = [3, 3], target = 6', expectedOutput: '[0, 1]', explanation: 'Boundary duplicate elements case 3' },
      { input: 'nums = [-1, -2, -3], target = -5', expectedOutput: '[1, 2]', explanation: 'Negative numbers case 4' }
    ],
    hiddenTestCases: [
      { input: 'nums = [1, 5, 10], target = 6', expectedOutput: '[0, 1]' },
      { input: 'nums = [2, 6, 11], target = 7', expectedOutput: '[0, 1]' },
      { input: 'nums = [3, 7, 12], target = 8', expectedOutput: '[0, 1]' },
      { input: 'nums = [4, 8, 13], target = 9', expectedOutput: '[0, 1]' },
      { input: 'nums = [5, 9, 14], target = 10', expectedOutput: '[0, 1]' },
      { input: 'nums = [6, 10, 15], target = 11', expectedOutput: '[0, 1]' },
      { input: 'nums = [7, 11, 16], target = 12', expectedOutput: '[0, 1]' },
      { input: 'nums = [8, 12, 17], target = 13', expectedOutput: '[0, 1]' },
      { input: 'nums = [9, 13, 18], target = 14', expectedOutput: '[0, 1]' },
      { input: 'nums = [10, 14, 19], target = 15', expectedOutput: '[0, 1]' },
      { input: 'nums = [11, 15, 20], target = 16', expectedOutput: '[0, 1]' },
      { input: 'nums = [12, 16, 21], target = 17', expectedOutput: '[0, 1]' }
    ]
  },
  {
    title: 'Asteroid Collision Simulation',
    slug: 'asteroid-collision-simulation',
    description: `Given an input configuration, solve the Asteroid Collision Simulation problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Stack',
    tags: ['stack', 'simulation'],
    examples: [
      { input: 'Sample Input 1', output: 'Sample Output 1', explanation: 'Primary problem example' }
    ],
    constraints: ['1 <= N <= 10^5'],
    starterCode: {
      java: `class Solution {
    public int solve() {
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int solve() {
        return 0;
    }
};`,
      python: `class Solution:
    def solve(self) -> int:
        return 0`,
      javascript: `function solve() {
    return 0;
}`,
      typescript: `function solve(): number {
    return 0;
}`
    },
    visibleTestCases: [
      { input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', explanation: 'Standard visible case 1' },
      { input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[1, 2]', explanation: 'Representative test case 2' },
      { input: 'nums = [3, 3], target = 6', expectedOutput: '[0, 1]', explanation: 'Boundary duplicate elements case 3' },
      { input: 'nums = [-1, -2, -3], target = -5', expectedOutput: '[1, 2]', explanation: 'Negative numbers case 4' }
    ],
    hiddenTestCases: [
      { input: 'nums = [1, 5, 10], target = 6', expectedOutput: '[0, 1]' },
      { input: 'nums = [2, 6, 11], target = 7', expectedOutput: '[0, 1]' },
      { input: 'nums = [3, 7, 12], target = 8', expectedOutput: '[0, 1]' },
      { input: 'nums = [4, 8, 13], target = 9', expectedOutput: '[0, 1]' },
      { input: 'nums = [5, 9, 14], target = 10', expectedOutput: '[0, 1]' },
      { input: 'nums = [6, 10, 15], target = 11', expectedOutput: '[0, 1]' },
      { input: 'nums = [7, 11, 16], target = 12', expectedOutput: '[0, 1]' },
      { input: 'nums = [8, 12, 17], target = 13', expectedOutput: '[0, 1]' },
      { input: 'nums = [9, 13, 18], target = 14', expectedOutput: '[0, 1]' },
      { input: 'nums = [10, 14, 19], target = 15', expectedOutput: '[0, 1]' },
      { input: 'nums = [11, 15, 20], target = 16', expectedOutput: '[0, 1]' },
      { input: 'nums = [12, 16, 21], target = 17', expectedOutput: '[0, 1]' }
    ]
  }
];
