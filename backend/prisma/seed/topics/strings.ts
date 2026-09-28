import { CodingProblemSeedInput } from '../types';

export const stringProblems: CodingProblemSeedInput[] = [
  {
    title: "Valid Anagram Check",
    slug: 'valid-anagram-check',
    description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'EASY',
    topic: 'Strings',
    tags: ['string', 'hashing'],
    examples: [
      {
            "input": "s = \"anagram\", t = \"nagaram\"",
            "output": "true",
            "explanation": "Both strings contain identical character counts."
      },
      {
            "input": "s = \"rat\", t = \"car\"",
            "output": "false",
            "explanation": "Frequencies do not match."
      }
],
    constraints: [
      "1 <= s.length, t.length <= 5 * 10^4"
],
    starterCode: {
      java: "class Solution {\n    public boolean isAnagram(String s, String t) {\n        return false;\n    }\n}",
      cpp: "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        return false;\n    }\n};",
      python: "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        return False",
      javascript: "function isAnagram(s, t) {\n    return false;\n}",
      typescript: "function isAnagram(s: string, t: string): boolean {\n    return false;\n}"
    },
    visibleTestCases: [
      {
            "input": "s = \"anagram\", t = \"nagaram\"",
            "expectedOutput": "true"
      },
      {
            "input": "s = \"rat\", t = \"car\"",
            "expectedOutput": "false"
      }
],
    hiddenTestCases: [
      {
            "input": "s = \"a\", t = \"a\"",
            "expectedOutput": "true"
      }
]
  },
  {
    title: "Valid Palindrome Phrase",
    slug: 'valid-palindrome-phrase',
    description: "Given a string `s`, return `true` if it is a palindrome after converting uppercase to lowercase and ignoring non-alphanumeric characters.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'EASY',
    topic: 'Strings',
    tags: ['string', 'two-pointers'],
    examples: [
      {
            "input": "s = \"A man, a plan, a canal: Panama\"",
            "output": "true",
            "explanation": "\"amanaplanacanalpanama\" is a palindrome."
      },
      {
            "input": "s = \"race a car\"",
            "output": "false",
            "explanation": "\"raceacar\" is not a palindrome."
      }
],
    constraints: [
      "1 <= s.length <= 2 * 10^5"
],
    starterCode: {
      java: "class Solution {\n    public boolean isPalindrome(String s) {\n        return true;\n    }\n}",
      cpp: "class Solution {\npublic:\n    bool isPalindrome(string s) {\n        return true;\n    }\n};",
      python: "class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        return True",
      javascript: "function isPalindrome(s) {\n    return true;\n}",
      typescript: "function isPalindrome(s: string): boolean {\n    return true;\n}"
    },
    visibleTestCases: [
      {
            "input": "s = \"A man, a plan, a canal: Panama\"",
            "expectedOutput": "true"
      },
      {
            "input": "s = \"race a car\"",
            "expectedOutput": "false"
      }
],
    hiddenTestCases: [
      {
            "input": "s = \" \"",
            "expectedOutput": "true"
      }
]
  },
  {
    title: "Longest Substring Without Repeating Characters",
    slug: 'longest-substring-without-repeating-characters',
    description: "Given input configuration with parameters `nums, target`, solve the `Longest Substring Without Repeating Characters` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Strings',
    tags: ['string', 'sliding-window'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "Standard example for Longest Substring Without Repeating Characters"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int longestSubstring(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int longestSubstring(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def longestSubstring(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function longestSubstring(nums, target) {\n    return 0;\n}",
      typescript: "function longestSubstring(nums: number[], target: int): int {\n    return 0;\n}"
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
    title: "String Compression Run-Length",
    slug: 'string-compression-run-length',
    description: "Given input configuration with parameters `s`, solve the `String Compression Run-Length` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Strings',
    tags: ['string', 'two-pointers'],
    examples: [
      {
            "input": "s = \"example\"",
            "output": "7",
            "explanation": "Standard example for String Compression Run-Length"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int stringCompression(String s) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int stringCompression(string s) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def stringCompression(self, s: str) -> int:\n        return 0",
      javascript: "function stringCompression(s) {\n    return 0;\n}",
      typescript: "function stringCompression(s: string): int {\n    return 0;\n}"
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
    title: "Group Anagrams Together",
    slug: 'group-anagrams-together',
    description: "Given input configuration with parameters `s`, solve the `Group Anagrams Together` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Strings',
    tags: ['string', 'hash-table'],
    examples: [
      {
            "input": "s = \"example\"",
            "output": "7",
            "explanation": "Standard example for Group Anagrams Together"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int groupAnagrams(String s) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int groupAnagrams(string s) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def groupAnagrams(self, s: str) -> int:\n        return 0",
      javascript: "function groupAnagrams(s) {\n    return 0;\n}",
      typescript: "function groupAnagrams(s: string): int {\n    return 0;\n}"
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
    title: "Longest Palindromic Substring",
    slug: 'longest-palindromic-substring',
    description: "Given input configuration with parameters `nums, target`, solve the `Longest Palindromic Substring` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Strings',
    tags: ['string', 'dynamic-programming'],
    examples: [
      {
            "input": "nums = [1, 3, 5, 6], target = 5",
            "output": "2",
            "explanation": "Standard example for Longest Palindromic Substring"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int longestPalindromic(int[] nums, int target) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int longestPalindromic(vector<int>& nums, int target) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def longestPalindromic(self, nums: List[int], target: int) -> int:\n        return 0",
      javascript: "function longestPalindromic(nums, target) {\n    return 0;\n}",
      typescript: "function longestPalindromic(nums: number[], target: int): int {\n    return 0;\n}"
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
    title: "Count and Say Sequence",
    slug: 'count-and-say-sequence',
    description: "Given input configuration with parameters `nums`, solve the `Count and Say Sequence` problem satisfying all time and memory complexity constraints.",
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: 'MEDIUM',
    topic: 'Strings',
    tags: ['string', 'recursion'],
    examples: [
      {
            "input": "nums = [1, 2, 3]",
            "output": "0",
            "explanation": "Standard example for Count and Say Sequence"
      }
],
    constraints: [
      "1 <= N <= 10^5",
      "All elements satisfy standard problem bounds."
],
    starterCode: {
      java: "class Solution {\n    public int countAnd(int[] nums) {\n        return 0;\n    }\n}",
      cpp: "class Solution {\npublic:\n    int countAnd(vector<int>& nums) {\n        return 0;\n    }\n};",
      python: "class Solution:\n    def countAnd(self, nums: List[int]) -> int:\n        return 0",
      javascript: "function countAnd(nums) {\n    return 0;\n}",
      typescript: "function countAnd(nums: number[]): int {\n    return 0;\n}"
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
