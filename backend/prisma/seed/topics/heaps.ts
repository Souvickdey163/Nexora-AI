import { CodingProblemSeedInput } from '../types';

export const heapProblems: CodingProblemSeedInput[] = [
  {
    title: "K-th Largest Element in an Array",
    slug: 'kth-largest-element-in-an-array',
    description: "Given input configuration with parameters `nums, target`, solve the `K-th Largest Element in an Array` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Heap',
    tags: ['heap', 'quick-select'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "Standard example for K-th Largest Element in an Array"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int kTh(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int kTh(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def kTh(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function kTh(nums, target) {\n    return 0;\n}",
      typescript: "function kTh(nums: number[], target: int): int {\n    return 0;\n}"
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
    title: "Top K Frequent Elements",
    slug: 'top-k-frequent-elements',
    description: "Given input configuration with parameters `nums`, solve the `Top K Frequent Elements` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Heap',
    tags: ['heap', 'hash-table'],
    examples: [
      {
            "input": "nums = [1, 2, 3]",
            "output": "0",
            "explanation": "Standard example for Top K Frequent Elements"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int topK(int[] nums) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int topK(vector<int>& nums) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def topK(self, nums: List[int]) -> int:\n        return 0",
      javascript: "function topK(nums) {\n    return 0;\n}",
      typescript: "function topK(nums: number[]): int {\n    return 0;\n}"
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
    title: "Merge K Sorted Lists",
    slug: 'merge-k-sorted-lists',
    description: "Given input configuration with parameters `nums, target`, solve the `Merge K Sorted Lists` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'HARD',
    topic: 'Heap',
    tags: ['heap', 'linked-list'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "Standard example for Merge K Sorted Lists"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int mergeKSortedLists(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int mergeKSortedLists(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def mergeKSortedLists(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function mergeKSortedLists(nums, target) {\n    return 0;\n}",
      typescript: "function mergeKSortedLists(nums: number[], target: int): int {\n    return 0;\n}"
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
    title: "Find Median from Data Stream",
    slug: 'find-median-from-data-stream',
    description: "Given input configuration with parameters `nums`, solve the `Find Median from Data Stream` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'HARD',
    topic: 'Heap',
    tags: ['heap', 'design'],
    examples: [
      {
            "input": "nums = [1, 2, 3]",
            "output": "0",
            "explanation": "Standard example for Find Median from Data Stream"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int findMedian(int[] nums) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int findMedian(vector<int>& nums) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def findMedian(self, nums: List[int]) -> int:\n        return 0",
      javascript: "function findMedian(nums) {\n    return 0;\n}",
      typescript: "function findMedian(nums: number[]): int {\n    return 0;\n}"
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
    title: "Task Scheduler Minimum Interval",
    slug: 'task-scheduler-minimum-interval',
    description: "Given input configuration with parameters `nums`, solve the `Task Scheduler Minimum Interval` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Heap',
    tags: ['heap', 'greedy'],
    examples: [
      {
            "input": "nums = [1, 2, 3]",
            "output": "0",
            "explanation": "Standard example for Task Scheduler Minimum Interval"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int taskScheduler(int[] nums) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int taskScheduler(vector<int>& nums) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def taskScheduler(self, nums: List[int]) -> int:\n        return 0",
      javascript: "function taskScheduler(nums) {\n    return 0;\n}",
      typescript: "function taskScheduler(nums: number[]): int {\n    return 0;\n}"
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
    title: "K Closest Points to Origin",
    slug: 'k-closest-points-to-origin',
    description: "Given input configuration with parameters `nums`, solve the `K Closest Points to Origin` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Heap',
    tags: ['heap', 'geometry'],
    examples: [
      {
            "input": "nums = [1, 2, 3]",
            "output": "0",
            "explanation": "Standard example for K Closest Points to Origin"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int kClosest(int[] nums) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int kClosest(vector<int>& nums) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def kClosest(self, nums: List[int]) -> int:\n        return 0",
      javascript: "function kClosest(nums) {\n    return 0;\n}",
      typescript: "function kClosest(nums: number[]): int {\n    return 0;\n}"
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
  }
];
