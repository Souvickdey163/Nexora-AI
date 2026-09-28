import { CodingProblemSeedInput } from '../types';

export const arrayProblems: CodingProblemSeedInput[] = [
  {
    title: "Maximum Subarray Sum (Kadane)",
    slug: 'maximum-subarray-sum',
    description: "Given an integer array `nums`, find the contiguous subarray with the largest sum, and return its sum.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Arrays',
    tags: ['array', 'dynamic-programming'],
    examples: [
      {
            "input": "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
            "output": "6",
            "explanation": "[4,-1,2,1] has the largest sum 6."
      },
      {
            "input": "nums = [1]",
            "output": "1",
            "explanation": "Single element."
      }
],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
],
    starterCode: {
      java: "class Solution {\n    public int maxSubArray(int[] nums) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        return 0",
      javascript: "function maxSubArray(nums) {\n    return 0;\n}",
      typescript: "function maxSubArray(nums: number[]): int {\n    return 0;\n}"
    },
    visibleTestCases: [
      {
            "input": "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
            "expectedOutput": "6"
      },
      {
            "input": "nums = [1]",
            "expectedOutput": "1"
      }
],
    hiddenTestCases: [
      {
            "input": "nums = [5, 4, -1, 7, 8]",
            "expectedOutput": "23"
      }
]
  },
  {
    title: "Two Sum Target Index Pair",
    slug: 'two-sum-target-index-pair',
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'EASY',
    topic: 'Arrays',
    tags: ['array', 'hash-table'],
    examples: [
      {
            "input": "nums = [2, 7, 11, 15], target = 9",
            "output": "[0, 1]",
            "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
            "input": "nums = [3, 2, 4], target = 6",
            "output": "[1, 2]",
            "explanation": "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9"
],
    starterCode: {
      java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{0, 1};\n    }\n}",
      cpp: "class Solution {\npublic:\n    vector<int>& twoSum(vector<int>& nums, int target) {\n        return {};\n    }\n};",
      python: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        return []",
      javascript: "function twoSum(nums, target) {\n    return [0, 1];\n}",
      typescript: "function twoSum(nums: number[], target: int): number[] {\n    return [0, 1];\n}"
    },
    visibleTestCases: [
      {
            "input": "nums = [2, 7, 11, 15], target = 9",
            "expectedOutput": "[0, 1]"
      },
      {
            "input": "nums = [3, 2, 4], target = 6",
            "expectedOutput": "[1, 2]"
      }
],
    hiddenTestCases: [
      {
            "input": "nums = [3, 3], target = 6",
            "expectedOutput": "[0, 1]"
      }
]
  },
  {
    title: "Rotate Array Right by K Steps",
    slug: 'rotate-array-right-by-k-steps',
    description: "Given input configuration with parameters `nums, target`, solve the `Rotate Array Right by K Steps` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Arrays',
    tags: ['array', 'two-pointers'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "Standard example for Rotate Array Right by K Steps"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int rotateArray(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int rotateArray(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def rotateArray(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function rotateArray(nums, target) {\n    return 0;\n}",
      typescript: "function rotateArray(nums: number[], target: int): int {\n    return 0;\n}"
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
    title: "Move Zeroes to End of Array",
    slug: 'move-zeroes-to-end-of-array',
    description: "Given input configuration with parameters `nums, target`, solve the `Move Zeroes to End of Array` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'EASY',
    topic: 'Arrays',
    tags: ['array', 'two-pointers'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "Standard example for Move Zeroes to End of Array"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int moveZeroes(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int moveZeroes(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def moveZeroes(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function moveZeroes(nums, target) {\n    return 0;\n}",
      typescript: "function moveZeroes(nums: number[], target: int): int {\n    return 0;\n}"
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
    title: "Find Duplicate Number in Constant Space",
    slug: 'find-duplicate-number-constant-space',
    description: "Given input configuration with parameters `nums, target`, solve the `Find Duplicate Number in Constant Space` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Arrays',
    tags: ['array', 'two-pointers'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "Standard example for Find Duplicate Number in Constant Space"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int findDuplicate(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int findDuplicate(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def findDuplicate(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function findDuplicate(nums, target) {\n    return 0;\n}",
      typescript: "function findDuplicate(nums: number[], target: int): int {\n    return 0;\n}"
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
    title: "Product of Array Except Self",
    slug: 'product-of-array-except-self',
    description: "Given input configuration with parameters `nums, target`, solve the `Product of Array Except Self` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Arrays',
    tags: ['array', 'prefix-sum'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "Standard example for Product of Array Except Self"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int productOf(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int productOf(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def productOf(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function productOf(nums, target) {\n    return 0;\n}",
      typescript: "function productOf(nums: number[], target: int): int {\n    return 0;\n}"
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
    title: "Container With Most Water",
    slug: 'container-with-most-water',
    description: "Given input configuration with parameters `nums, target`, solve the `Container With Most Water` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Arrays',
    tags: ['array', 'two-pointers'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "Standard example for Container With Most Water"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int containerWith(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int containerWith(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def containerWith(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function containerWith(nums, target) {\n    return 0;\n}",
      typescript: "function containerWith(nums: number[], target: int): int {\n    return 0;\n}"
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
