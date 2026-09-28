import { CodingProblemSeedInput } from '../types';

export const hashingProblems: CodingProblemSeedInput[] = [
  {
    title: "Contains Duplicate Check",
    slug: 'contains-duplicate-check',
    description: "Given input configuration with parameters `nums, target`, solve the `Contains Duplicate Check` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'EASY',
    topic: 'Hashing',
    tags: ['hash-table', 'array'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "Standard example for Contains Duplicate Check"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int containsDuplicate(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int containsDuplicate(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def containsDuplicate(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function containsDuplicate(nums, target) {\n    return 0;\n}",
      typescript: "function containsDuplicate(nums: number[], target: int): int {\n    return 0;\n}"
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
    title: "Intersection of Two Arrays",
    slug: 'intersection-of-two-arrays',
    description: "Given input configuration with parameters `nums, target`, solve the `Intersection of Two Arrays` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'EASY',
    topic: 'Hashing',
    tags: ['hash-table', 'two-pointers'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "Standard example for Intersection of Two Arrays"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int intersectionOf(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int intersectionOf(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def intersectionOf(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function intersectionOf(nums, target) {\n    return 0;\n}",
      typescript: "function intersectionOf(nums: number[], target: int): int {\n    return 0;\n}"
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
    title: "Subarray Sum Equals K",
    slug: 'subarray-sum-equals-k',
    description: "Given input configuration with parameters `nums, target`, solve the `Subarray Sum Equals K` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Hashing',
    tags: ['hash-table', 'prefix-sum'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "Standard example for Subarray Sum Equals K"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int subarraySumEqualsK(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int subarraySumEqualsK(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def subarraySumEqualsK(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function subarraySumEqualsK(nums, target) {\n    return 0;\n}",
      typescript: "function subarraySumEqualsK(nums: number[], target: int): int {\n    return 0;\n}"
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
    title: "Longest Consecutive Sequence",
    slug: 'longest-consecutive-sequence',
    description: "Given input configuration with parameters `nums`, solve the `Longest Consecutive Sequence` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Hashing',
    tags: ['hash-table', 'union-find'],
    examples: [
      {
            "input": "nums = [1, 2, 3]",
            "output": "0",
            "explanation": "Standard example for Longest Consecutive Sequence"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int longestConsecutive(int[] nums) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int longestConsecutive(vector<int>& nums) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def longestConsecutive(self, nums: List[int]) -> int:\n        return 0",
      javascript: "function longestConsecutive(nums) {\n    return 0;\n}",
      typescript: "function longestConsecutive(nums: number[]): int {\n    return 0;\n}"
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
    title: "Isomorphic Strings Verification",
    slug: 'isomorphic-strings-verification',
    description: "Given input configuration with parameters `s`, solve the `Isomorphic Strings Verification` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'EASY',
    topic: 'Hashing',
    tags: ['hash-table', 'string'],
    examples: [
      {
            "input": "s = \"example\"",
            "output": "7",
            "explanation": "Standard example for Isomorphic Strings Verification"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int isomorphicStrings(String s) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int isomorphicStrings(string s) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def isomorphicStrings(self, s: str) -> int:\n        return 0",
      javascript: "function isomorphicStrings(s) {\n    return 0;\n}",
      typescript: "function isomorphicStrings(s: string): int {\n    return 0;\n}"
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
  },
  {
    title: "Unique Word Abbreviation Data Structure",
    slug: 'unique-word-abbreviation-data-structure',
    description: "Given input configuration with parameters `s`, solve the `Unique Word Abbreviation Data Structure` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Hashing',
    tags: ['hash-table', 'design'],
    examples: [
      {
            "input": "s = \"example\"",
            "output": "7",
            "explanation": "Standard example for Unique Word Abbreviation Data Structure"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int uniqueWord(String s) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int uniqueWord(string s) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def uniqueWord(self, s: str) -> int:\n        return 0",
      javascript: "function uniqueWord(s) {\n    return 0;\n}",
      typescript: "function uniqueWord(s: string): int {\n    return 0;\n}"
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
  },
  {
    title: "First Unique Character in a String",
    slug: 'first-unique-character-in-a-string',
    description: "Given input configuration with parameters `s`, solve the `First Unique Character in a String` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'EASY',
    topic: 'Hashing',
    tags: ['hash-table', 'queue'],
    examples: [
      {
            "input": "s = \"example\"",
            "output": "7",
            "explanation": "Standard example for First Unique Character in a String"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int firstUnique(String s) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int firstUnique(string s) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def firstUnique(self, s: str) -> int:\n        return 0",
      javascript: "function firstUnique(s) {\n    return 0;\n}",
      typescript: "function firstUnique(s: string): int {\n    return 0;\n}"
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
