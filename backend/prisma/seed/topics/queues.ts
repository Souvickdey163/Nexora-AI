import { CodingProblemSeedInput } from '../types';

export const queueProblems: CodingProblemSeedInput[] = [
  {
    title: 'Implement Queue using Stacks',
    slug: 'implement-queue-using-stacks',
    description: `Given an input configuration, solve the Implement Queue using Stacks problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'EASY',
    topic: 'Queue',
    tags: ['queue', 'stack'],
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
    title: 'Sliding Window Maximum',
    slug: 'sliding-window-maximum',
    description: `Given an input configuration, solve the Sliding Window Maximum problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'HARD',
    topic: 'Queue',
    tags: ['queue', 'deque', 'sliding-window'],
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
    title: 'Rotting Oranges Grid Simulation',
    slug: 'rotting-oranges-grid-simulation',
    description: `Given an input configuration, solve the Rotting Oranges Grid Simulation problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Queue',
    tags: ['queue', 'bfs'],
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
    title: 'Design Circular Deque',
    slug: 'design-circular-deque',
    description: `Given an input configuration, solve the Design Circular Deque problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Queue',
    tags: ['queue', 'design'],
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
    title: 'Dota2 Senate Radiant vs Dire',
    slug: 'dota2-senate-radiant-vs-dire',
    description: `Given an input configuration, solve the Dota2 Senate Radiant vs Dire problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Queue',
    tags: ['queue', 'greedy'],
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
    title: 'Number of Recent Calls Counter',
    slug: 'number-of-recent-calls-counter',
    description: `Given an input configuration, solve the Number of Recent Calls Counter problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'EASY',
    topic: 'Queue',
    tags: ['queue', 'design'],
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
