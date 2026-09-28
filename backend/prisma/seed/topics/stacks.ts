import { CodingProblemSeedInput } from '../types';

export const stackProblems: CodingProblemSeedInput[] = [
  {
    title: "Valid Parentheses Matching",
    slug: 'valid-parentheses-matching',
    description: "Given a string `s` containing brackets '()[]{}', return `true` if input is valid (correct open/close order and type).",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'EASY',
    topic: 'Stack',
    tags: ['stack', 'string'],
    examples: [
      {
            "input": "s = \"()\"",
            "output": "true",
            "explanation": "Valid pair."
      },
      {
            "input": "s = \"()[]{}\"",
            "output": "true",
            "explanation": "Valid sequence."
      },
      {
            "input": "s = \"(]\"",
            "output": "false",
            "explanation": "Mismatched type."
      }
],
    constraints: [
      "1 <= s.length <= 10^4"
],
    starterCode: {
      java: "class Solution {\n    public boolean isValid(String s) {\n        return true;\n    }\n}",
      cpp: "class Solution {\npublic:\n    bool isValid(string s) {\n        return true;\n    }\n};",
      python: "class Solution:\n    def isValid(self, s: str) -> bool:\n        return True",
      javascript: "function isValid(s) {\n    return true;\n}",
      typescript: "function isValid(s: string): boolean {\n    return true;\n}"
    },
    visibleTestCases: [
      {
            "input": "s = \"()\"",
            "expectedOutput": "true"
      },
      {
            "input": "s = \"()[]{}\"",
            "expectedOutput": "true"
      },
      {
            "input": "s = \"(]\"",
            "expectedOutput": "false"
      }
],
    hiddenTestCases: [
      {
            "input": "s = \"([)]\"",
            "expectedOutput": "false"
      }
]
  },
  {
    title: "Min Stack Constant Time Retrieval",
    slug: 'min-stack-constant-time-retrieval',
    description: "Given input configuration with parameters `nums`, solve the `Min Stack Constant Time Retrieval` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Stack',
    tags: ['stack', 'design'],
    examples: [
      {
            "input": "nums = [1, 2, 3]",
            "output": "0",
            "explanation": "Standard example for Min Stack Constant Time Retrieval"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int minStack(int[] nums) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int minStack(vector<int>& nums) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def minStack(self, nums: List[int]) -> int:\n        return 0",
      javascript: "function minStack(nums) {\n    return 0;\n}",
      typescript: "function minStack(nums: number[]): int {\n    return 0;\n}"
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
    title: "Evaluate Reverse Polish Notation",
    slug: 'evaluate-reverse-polish-notation',
    description: "Given input configuration with parameters `nums`, solve the `Evaluate Reverse Polish Notation` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Stack',
    tags: ['stack', 'math'],
    examples: [
      {
            "input": "nums = [1, 2, 3]",
            "output": "0",
            "explanation": "Standard example for Evaluate Reverse Polish Notation"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int evaluateReverse(int[] nums) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int evaluateReverse(vector<int>& nums) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def evaluateReverse(self, nums: List[int]) -> int:\n        return 0",
      javascript: "function evaluateReverse(nums) {\n    return 0;\n}",
      typescript: "function evaluateReverse(nums: number[]): int {\n    return 0;\n}"
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
    title: "Daily Temperatures Next Warmer Day",
    slug: 'daily-temperatures-next-warmer-day',
    description: "Given input configuration with parameters `nums`, solve the `Daily Temperatures Next Warmer Day` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Stack',
    tags: ['stack', 'monotonic-stack'],
    examples: [
      {
            "input": "nums = [1, 2, 3]",
            "output": "0",
            "explanation": "Standard example for Daily Temperatures Next Warmer Day"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int dailyTemperatures(int[] nums) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int dailyTemperatures(vector<int>& nums) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def dailyTemperatures(self, nums: List[int]) -> int:\n        return 0",
      javascript: "function dailyTemperatures(nums) {\n    return 0;\n}",
      typescript: "function dailyTemperatures(nums: number[]): int {\n    return 0;\n}"
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
    title: "Decode String Nested Multipliers",
    slug: 'decode-string-nested-multipliers',
    description: "Given input configuration with parameters `s`, solve the `Decode String Nested Multipliers` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Stack',
    tags: ['stack', 'recursion'],
    examples: [
      {
            "input": "s = \"example\"",
            "output": "7",
            "explanation": "Standard example for Decode String Nested Multipliers"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int decodeString(String s) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int decodeString(string s) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def decodeString(self, s: str) -> int:\n        return 0",
      javascript: "function decodeString(s) {\n    return 0;\n}",
      typescript: "function decodeString(s: string): int {\n    return 0;\n}"
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
    title: "Asteroid Collision Simulation",
    slug: 'asteroid-collision-simulation',
    description: "Given input configuration with parameters `nums`, solve the `Asteroid Collision Simulation` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Stack',
    tags: ['stack', 'simulation'],
    examples: [
      {
            "input": "nums = [1, 2, 3]",
            "output": "0",
            "explanation": "Standard example for Asteroid Collision Simulation"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int asteroidCollision(int[] nums) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int asteroidCollision(vector<int>& nums) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def asteroidCollision(self, nums: List[int]) -> int:\n        return 0",
      javascript: "function asteroidCollision(nums) {\n    return 0;\n}",
      typescript: "function asteroidCollision(nums: number[]): int {\n    return 0;\n}"
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
