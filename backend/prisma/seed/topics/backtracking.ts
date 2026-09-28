import { CodingProblemSeedInput } from '../types';

export const backtrackingProblems: CodingProblemSeedInput[] = [
  {
    title: "N-Queens Non-Attacking Placements",
    slug: 'n-queens-non-attacking-placements',
    description: "Given input configuration with parameters `nums`, solve the `N-Queens Non-Attacking Placements` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'HARD',
    topic: 'Backtracking',
    tags: ['backtracking'],
    examples: [
      {
            "input": "nums = [1, 2, 3]",
            "output": "0",
            "explanation": "Standard example for N-Queens Non-Attacking Placements"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int nQueens(int[] nums) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int nQueens(vector<int>& nums) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def nQueens(self, nums: List[int]) -> int:\n        return 0",
      javascript: "function nQueens(nums) {\n    return 0;\n}",
      typescript: "function nQueens(nums: number[]): int {\n    return 0;\n}"
    },
    visibleTestCases: [
      {
            "input": "nums = [1, 2, 3]",
            "expectedOutput": "0",
            "explanation": "Visible sample test case"
      }
],
    hiddenTestCases: [
      {
            "input": "nums = [1, 2, 3]",
            "expectedOutput": "0"
      }
]
  },
  {
    title: "Permutations of Unique Integers",
    slug: 'permutations-of-unique-integers',
    description: "Given input configuration with parameters `nums`, solve the `Permutations of Unique Integers` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Backtracking',
    tags: ['backtracking'],
    examples: [
      {
            "input": "nums = [1, 2, 3]",
            "output": "0",
            "explanation": "Standard example for Permutations of Unique Integers"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int permutationsOf(int[] nums) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int permutationsOf(vector<int>& nums) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def permutationsOf(self, nums: List[int]) -> int:\n        return 0",
      javascript: "function permutationsOf(nums) {\n    return 0;\n}",
      typescript: "function permutationsOf(nums: number[]): int {\n    return 0;\n}"
    },
    visibleTestCases: [
      {
            "input": "nums = [1, 2, 3]",
            "expectedOutput": "0",
            "explanation": "Visible sample test case"
      }
],
    hiddenTestCases: [
      {
            "input": "nums = [1, 2, 3]",
            "expectedOutput": "0"
      }
]
  },
  {
    title: "All Possible Subsets Power Set",
    slug: 'all-possible-subsets-power-set',
    description: "Given input configuration with parameters `nums, target`, solve the `All Possible Subsets Power Set` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Backtracking',
    tags: ['backtracking'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "Standard example for All Possible Subsets Power Set"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int allPossible(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int allPossible(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def allPossible(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function allPossible(nums, target) {\n    return 0;\n}",
      typescript: "function allPossible(nums: number[], target: int): int {\n    return 0;\n}"
    },
    visibleTestCases: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "expectedOutput": "2",
            "explanation": "Visible sample test case"
      }
],
    hiddenTestCases: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "expectedOutput": "2"
      }
]
  },
  {
    title: "Combination Sum Target Combination",
    slug: 'combination-sum-target-combination',
    description: "Given input configuration with parameters `nums, target`, solve the `Combination Sum Target Combination` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Backtracking',
    tags: ['backtracking'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "Standard example for Combination Sum Target Combination"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int combinationSum(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int combinationSum(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def combinationSum(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function combinationSum(nums, target) {\n    return 0;\n}",
      typescript: "function combinationSum(nums: number[], target: int): int {\n    return 0;\n}"
    },
    visibleTestCases: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "expectedOutput": "2",
            "explanation": "Visible sample test case"
      }
],
    hiddenTestCases: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "expectedOutput": "2"
      }
]
  },
  {
    title: "Sudoku Solver 9x9 Grid",
    slug: 'sudoku-solver-9x9-grid',
    description: "Given input configuration with parameters `nums`, solve the `Sudoku Solver 9x9 Grid` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'HARD',
    topic: 'Backtracking',
    tags: ['backtracking'],
    examples: [
      {
            "input": "nums = [1, 2, 3]",
            "output": "0",
            "explanation": "Standard example for Sudoku Solver 9x9 Grid"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int sudokuSolver(int[] nums) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int sudokuSolver(vector<int>& nums) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def sudokuSolver(self, nums: List[int]) -> int:\n        return 0",
      javascript: "function sudokuSolver(nums) {\n    return 0;\n}",
      typescript: "function sudokuSolver(nums: number[]): int {\n    return 0;\n}"
    },
    visibleTestCases: [
      {
            "input": "nums = [1, 2, 3]",
            "expectedOutput": "0",
            "explanation": "Visible sample test case"
      }
],
    hiddenTestCases: [
      {
            "input": "nums = [1, 2, 3]",
            "expectedOutput": "0"
      }
]
  },
  {
    title: "Word Search in 2D Character Grid",
    slug: 'word-search-in-2d-character-grid',
    description: "Given input configuration with parameters `s`, solve the `Word Search in 2D Character Grid` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Backtracking',
    tags: ['backtracking'],
    examples: [
      {
            "input": "s = \"example\"",
            "output": "7",
            "explanation": "Standard example for Word Search in 2D Character Grid"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int wordSearch(String s) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int wordSearch(string s) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def wordSearch(self, s: str) -> int:\n        return 0",
      javascript: "function wordSearch(s) {\n    return 0;\n}",
      typescript: "function wordSearch(s: string): int {\n    return 0;\n}"
    },
    visibleTestCases: [
      {
            "input": "s = \"example\"",
            "expectedOutput": "7",
            "explanation": "Visible sample test case"
      }
],
    hiddenTestCases: [
      {
            "input": "s = \"example\"",
            "expectedOutput": "7"
      }
]
  }
];
