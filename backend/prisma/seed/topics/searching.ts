import { CodingProblemSeedInput } from '../types';

export const searchingProblems: CodingProblemSeedInput[] = [
  {
    title: "Binary Search Sorted Array Index",
    slug: 'binary-search-sorted-array-index',
    description: "Given a sorted array of distinct integers `nums` and a target value `target`, return the index if the target is found. If not, return the index where it would be if it were inserted in order.\n\nYou must write an algorithm with O(log n) runtime complexity.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'EASY',
    topic: 'Searching',
    tags: ['binary-search'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "5 is found at index 2."
      },
      {
            "input": "nums = [1, 3, 5, 6], target = 2",
            "output": "1",
            "explanation": "2 is missing, would be inserted at index 1."
      },
      {
            "input": "nums = [1, 3, 5, 6], target = 7",
            "output": "4",
            "explanation": "7 is missing, would be inserted at index 4."
      }
],
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 <= nums[i] <= 10^4",
      "nums contains distinct values sorted in ascending order.",
      "-10^4 <= target <= 10^4"
],
    starterCode: {
      java: "class Solution {\n    public int searchInsert(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int searchInsert(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def searchInsert(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function searchInsert(nums, target) {\n    return 0;\n}",
      typescript: "function searchInsert(nums: number[], target: int): int {\n    return 0;\n}"
    },
    visibleTestCases: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "expectedOutput": "2",
            "explanation": "Target 5 found at index 2"
      },
      {
            "input": "nums = [1, 3, 5, 6], target = 2",
            "expectedOutput": "1",
            "explanation": "Target 2 belongs at index 1"
      },
      {
            "input": "nums = [1, 3, 5, 6], target = 7",
            "expectedOutput": "4",
            "explanation": "Target 7 belongs at index 4"
      }
],
    hiddenTestCases: [
      {
            "input": "nums = [1, 3, 5, 6], target = 0",
            "expectedOutput": "0"
      }
]
  },
  {
    title: "Search in Rotated Sorted Array",
    slug: 'search-in-rotated-sorted-array',
    description: "Given a rotated sorted array `nums` and an integer `target`, return the index of `target` if present, or `-1` if not in `nums`.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Searching',
    tags: ['binary-search', 'array'],
    examples: [
      {
            "input": "nums = [4, 5, 6, 7, 0, 1, 2], target = 0",
            "output": "4",
            "explanation": "0 is at index 4."
      },
      {
            "input": "nums = [4, 5, 6, 7, 0, 1, 2], target = 3",
            "output": "-1",
            "explanation": "3 is not in nums."
      }
],
    constraints: [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique."
],
    starterCode: {
      java: "class Solution {\n    public int search(int[] nums, int target) {\n        return -1;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function search(nums, target) {\n    return -1;\n}",
      typescript: "function search(nums: number[], target: int): int {\n    return -1;\n}"
    },
    visibleTestCases: [
      {
            "input": "nums = [4, 5, 6, 7, 0, 1, 2], target = 0",
            "expectedOutput": "4"
      },
      {
            "input": "nums = [4, 5, 6, 7, 0, 1, 2], target = 3",
            "expectedOutput": "-1"
      }
],
    hiddenTestCases: [
      {
            "input": "nums = [1], target = 0",
            "expectedOutput": "-1"
      }
]
  },
  {
    title: "Find First and Last Position of Element",
    slug: 'find-first-and-last-position-of-element',
    description: "Given input configuration with parameters `nums`, solve the `Find First and Last Position of Element` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Searching',
    tags: ['binary-search'],
    examples: [
      {
            "input": "nums = [1, 2, 3]",
            "output": "0",
            "explanation": "Standard example for Find First and Last Position of Element"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int findFirst(int[] nums) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int findFirst(vector<int>& nums) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def findFirst(self, nums: List[int]) -> int:\n        return 0",
      javascript: "function findFirst(nums) {\n    return 0;\n}",
      typescript: "function findFirst(nums: number[]): int {\n    return 0;\n}"
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
    title: "Search a 2D Sorted Matrix",
    slug: 'search-a-2d-sorted-matrix',
    description: "Given input configuration with parameters `nums, target`, solve the `Search a 2D Sorted Matrix` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Searching',
    tags: ['binary-search', 'matrix'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "Standard example for Search a 2D Sorted Matrix"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int searchA(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int searchA(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def searchA(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function searchA(nums, target) {\n    return 0;\n}",
      typescript: "function searchA(nums: number[], target: int): int {\n    return 0;\n}"
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
    title: "Find Peak Element Local Maximum",
    slug: 'find-peak-element-local-maximum',
    description: "Given input configuration with parameters `nums, target`, solve the `Find Peak Element Local Maximum` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Searching',
    tags: ['binary-search'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "Standard example for Find Peak Element Local Maximum"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int findPeak(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int findPeak(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def findPeak(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function findPeak(nums, target) {\n    return 0;\n}",
      typescript: "function findPeak(nums: number[], target: int): int {\n    return 0;\n}"
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
    title: "Koko Eating Bananas Minimum Speed",
    slug: 'koko-eating-bananas-minimum-speed',
    description: "Given input configuration with parameters `nums, target`, solve the `Koko Eating Bananas Minimum Speed` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Searching',
    tags: ['binary-search'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "Standard example for Koko Eating Bananas Minimum Speed"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int kokoEating(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int kokoEating(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def kokoEating(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function kokoEating(nums, target) {\n    return 0;\n}",
      typescript: "function kokoEating(nums: number[], target: int): int {\n    return 0;\n}"
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
