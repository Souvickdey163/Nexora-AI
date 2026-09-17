import { CodingProblemSeedInput } from '../types';

export const bstProblems: CodingProblemSeedInput[] = [
  {
    title: 'Validate Binary Search Tree',
    slug: 'validate-binary-search-tree',
    description: `Given an input configuration, solve the Validate Binary Search Tree problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'BST',
    tags: ['bst', 'dfs'],
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
    title: 'Search in Binary Search Tree',
    slug: 'search-in-binary-search-tree',
    description: `Given an input configuration, solve the Search in Binary Search Tree problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'EASY',
    topic: 'BST',
    tags: ['bst', 'recursion'],
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
    title: 'Insert into a Binary Search Tree',
    slug: 'insert-into-a-binary-search-tree',
    description: `Given an input configuration, solve the Insert into a Binary Search Tree problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'BST',
    tags: ['bst', 'recursion'],
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
    title: 'K-th Smallest Element in a BST',
    slug: 'kth-smallest-element-in-a-bst',
    description: `Given an input configuration, solve the K-th Smallest Element in a BST problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'BST',
    tags: ['bst', 'inorder-traversal'],
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
    title: 'Delete Node in a BST',
    slug: 'delete-node-in-a-bst',
    description: `Given an input configuration, solve the Delete Node in a BST problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'BST',
    tags: ['bst', 'recursion'],
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
    title: 'Lowest Common Ancestor of a BST',
    slug: 'lowest-common-ancestor-of-a-bst',
    description: `Given an input configuration, solve the Lowest Common Ancestor of a BST problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'EASY',
    topic: 'BST',
    tags: ['bst', 'recursion'],
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
