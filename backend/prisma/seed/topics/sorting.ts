import { CodingProblemSeedInput } from '../types';

export const sortingProblems: CodingProblemSeedInput[] = [
  {
    title: 'Sort Array Merge Sort Algorithm',
    slug: 'sort-array-merge-sort-algorithm',
    description: `Given an input configuration, solve the Sort Array Merge Sort Algorithm problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Sorting',
    tags: ['sorting', 'divide-and-conquer'],
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
    title: 'Merge Intervals Overlapping Ranges',
    slug: 'merge-intervals-overlapping-ranges',
    description: `Given an input configuration, solve the Merge Intervals Overlapping Ranges problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Sorting',
    tags: ['sorting', 'array'],
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
    title: 'Sort Colors Dutch National Flag',
    slug: 'sort-colors-dutch-national-flag',
    description: `Given an input configuration, solve the Sort Colors Dutch National Flag problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Sorting',
    tags: ['sorting', 'two-pointers'],
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
    title: 'Insertion Sort List Singly Linked',
    slug: 'insertion-sort-list-singly-linked',
    description: `Given an input configuration, solve the Insertion Sort List Singly Linked problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Sorting',
    tags: ['sorting', 'linked-list'],
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
    title: 'Largest Number String Formed',
    slug: 'largest-number-string-formed',
    description: `Given an input configuration, solve the Largest Number String Formed problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Sorting',
    tags: ['sorting', 'string'],
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
    title: 'Custom Sort String Order',
    slug: 'custom-sort-string-order',
    description: `Given an input configuration, solve the Custom Sort String Order problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Sorting',
    tags: ['sorting', 'hash-table'],
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
