import { CodingProblemSeedInput } from '../types';

export const dpProblems: CodingProblemSeedInput[] = [
  {
    title: "Coin Change Minimum Coins",
    slug: 'coin-change-minimum-coins',
    description: "Given input configuration with parameters `nums`, solve the `Coin Change Minimum Coins` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Dynamic Programming',
    tags: ['dp'],
    examples: [
      {
            "input": "nums = [1, 2, 3]",
            "output": "0",
            "explanation": "Standard example for Coin Change Minimum Coins"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int coinChange(int[] nums) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int coinChange(vector<int>& nums) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def coinChange(self, nums: List[int]) -> int:\n        return 0",
      javascript: "function coinChange(nums) {\n    return 0;\n}",
      typescript: "function coinChange(nums: number[]): int {\n    return 0;\n}"
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
    title: "Longest Increasing Subsequence",
    slug: 'longest-increasing-subsequence',
    description: "Given input configuration with parameters `nums, target`, solve the `Longest Increasing Subsequence` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Dynamic Programming',
    tags: ['dp', 'binary-search'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "Standard example for Longest Increasing Subsequence"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int longestIncreasing(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int longestIncreasing(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def longestIncreasing(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function longestIncreasing(nums, target) {\n    return 0;\n}",
      typescript: "function longestIncreasing(nums: number[], target: int): int {\n    return 0;\n}"
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
    title: "Longest Common Subsequence",
    slug: 'longest-common-subsequence',
    description: "Given input configuration with parameters `nums, target`, solve the `Longest Common Subsequence` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Dynamic Programming',
    tags: ['dp', 'string'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "Standard example for Longest Common Subsequence"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int longestCommon(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int longestCommon(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def longestCommon(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function longestCommon(nums, target) {\n    return 0;\n}",
      typescript: "function longestCommon(nums: number[], target: int): int {\n    return 0;\n}"
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
    title: "0-1 Knapsack Maximum Value",
    slug: '0-1-knapsack-maximum-value',
    description: "Given input configuration with parameters `nums`, solve the `0-1 Knapsack Maximum Value` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Dynamic Programming',
    tags: ['dp'],
    examples: [
      {
            "input": "nums = [1, 2, 3]",
            "output": "0",
            "explanation": "Standard example for 0-1 Knapsack Maximum Value"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int 01(int[] nums) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int 01(vector<int>& nums) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def 01(self, nums: List[int]) -> int:\n        return 0",
      javascript: "function 01(nums) {\n    return 0;\n}",
      typescript: "function 01(nums: number[]): int {\n    return 0;\n}"
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
    title: "House Robber Maximum Amount",
    slug: 'house-robber-maximum-amount',
    description: "Given input configuration with parameters `nums`, solve the `House Robber Maximum Amount` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Dynamic Programming',
    tags: ['dp'],
    examples: [
      {
            "input": "nums = [1, 2, 3]",
            "output": "0",
            "explanation": "Standard example for House Robber Maximum Amount"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int houseRobber(int[] nums) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int houseRobber(vector<int>& nums) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def houseRobber(self, nums: List[int]) -> int:\n        return 0",
      javascript: "function houseRobber(nums) {\n    return 0;\n}",
      typescript: "function houseRobber(nums: number[]): int {\n    return 0;\n}"
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
    title: "Edit Distance Minimum Operations",
    slug: 'edit-distance-minimum-operations',
    description: "Given input configuration with parameters `nums`, solve the `Edit Distance Minimum Operations` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'HARD',
    topic: 'Dynamic Programming',
    tags: ['dp', 'string'],
    examples: [
      {
            "input": "nums = [1, 2, 3]",
            "output": "0",
            "explanation": "Standard example for Edit Distance Minimum Operations"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int editDistance(int[] nums) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int editDistance(vector<int>& nums) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def editDistance(self, nums: List[int]) -> int:\n        return 0",
      javascript: "function editDistance(nums) {\n    return 0;\n}",
      typescript: "function editDistance(nums: number[]): int {\n    return 0;\n}"
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
    title: "Partition Equal Subset Sum",
    slug: 'partition-equal-subset-sum',
    description: "Given input configuration with parameters `nums, target`, solve the `Partition Equal Subset Sum` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Dynamic Programming',
    tags: ['dp'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "Standard example for Partition Equal Subset Sum"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int partitionEqual(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int partitionEqual(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def partitionEqual(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function partitionEqual(nums, target) {\n    return 0;\n}",
      typescript: "function partitionEqual(nums: number[], target: int): int {\n    return 0;\n}"
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
  }
];
