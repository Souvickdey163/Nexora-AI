import os
import json

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TOPICS_DIR = os.path.join(SCRIPT_DIR, 'topics')

# Define rich problem specs for all 102 problems
PROBLEMS_SPEC = {
    'arrays': [
        {
            "title": "Maximum Subarray Sum (Kadane)",
            "slug": "maximum-subarray-sum",
            "diff": "MEDIUM",
            "topic": "Arrays",
            "tags": ["array", "dynamic-programming"],
            "func": "maxSubArray",
            "params": [("int[]", "nums")],
            "return": "int",
            "default_val": "0",
            "desc": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
            "examples": [
                {"input": "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]", "output": "6", "explanation": "The subarray [4,-1,2,1] has the largest sum 6."},
                {"input": "nums = [1]", "output": "1", "explanation": "The subarray [1] has the largest sum 1."},
                {"input": "nums = [5, 4, -1, 7, 8]", "output": "23", "explanation": "The subarray [5,4,-1,7,8] has the largest sum 23."}
            ],
            "constraints": ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
            "vis_cases": [
                {"input": "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]", "expectedOutput": "6", "explanation": "Subarray [4,-1,2,1] sum is 6"},
                {"input": "nums = [1]", "expectedOutput": "1", "explanation": "Single element array"},
                {"input": "nums = [5, 4, -1, 7, 8]", "expectedOutput": "23", "explanation": "Subarray with max sum 23"}
            ],
            "hid_cases": [
                {"input": "nums = [-1, -2, -3]", "expectedOutput": "-1"},
                {"input": "nums = [2, 3, -2, 4]", "expectedOutput": "5"}
            ]
        },
        {
            "title": "Two Sum Target Index Pair",
            "slug": "two-sum-target-index-pair",
            "diff": "EASY",
            "topic": "Arrays",
            "tags": ["array", "hash-table"],
            "func": "twoSum",
            "params": [("int[]", "nums"), ("int", "target")],
            "return": "int[]",
            "default_val": "new int[]{0, 0}",
            "desc": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
            "examples": [
                {"input": "nums = [2, 7, 11, 15], target = 9", "output": "[0, 1]", "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."},
                {"input": "nums = [3, 2, 4], target = 6", "output": "[1, 2]", "explanation": "Because nums[1] + nums[2] == 6, we return [1, 2]."},
                {"input": "nums = [3, 3], target = 6", "output": "[0, 1]", "explanation": "Because nums[0] + nums[1] == 6, we return [0, 1]."}
            ],
            "constraints": ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Exactly one valid answer exists."],
            "vis_cases": [
                {"input": "nums = [2, 7, 11, 15], target = 9", "expectedOutput": "[0, 1]", "explanation": "Target 9 formed by index 0 and 1"},
                {"input": "nums = [3, 2, 4], target = 6", "expectedOutput": "[1, 2]", "explanation": "Target 6 formed by index 1 and 2"},
                {"input": "nums = [3, 3], target = 6", "expectedOutput": "[0, 1]", "explanation": "Target 6 formed by index 0 and 1"}
            ],
            "hid_cases": [
                {"input": "nums = [1, 5, 10], target = 6", "expectedOutput": "[0, 1]"},
                {"input": "nums = [2, 6, 11], target = 7", "expectedOutput": "[0, 1]"}
            ]
        },
        {
            "title": "Rotate Array Right by K Steps",
            "slug": "rotate-array-right-by-k-steps",
            "diff": "MEDIUM",
            "topic": "Arrays",
            "tags": ["array", "two-pointers"],
            "func": "rotate",
            "params": [("int[]", "nums"), ("int", "k")],
            "return": "int[]",
            "default_val": "nums",
            "desc": "Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non-negative.",
            "examples": [
                {"input": "nums = [1, 2, 3, 4, 5, 6, 7], k = 3", "output": "[5, 6, 7, 1, 2, 3, 4]", "explanation": "Rotate 1 steps right: [7,1,2,3,4,5,6], 2 steps right: [6,7,1,2,3,4,5], 3 steps right: [5,6,7,1,2,3,4]"},
                {"input": "nums = [-1, -100, 3, 99], k = 2", "output": "[3, 99, -1, -100]", "explanation": "Rotate 2 steps right."}
            ],
            "constraints": ["1 <= nums.length <= 10^5", "-2^31 <= nums[i] <= 2^31 - 1", "0 <= k <= 10^5"],
            "vis_cases": [
                {"input": "nums = [1, 2, 3, 4, 5, 6, 7], k = 3", "expectedOutput": "[5, 6, 7, 1, 2, 3, 4]"},
                {"input": "nums = [-1, -100, 3, 99], k = 2", "expectedOutput": "[3, 99, -1, -100]"}
            ],
            "hid_cases": [
                {"input": "nums = [1, 2], k = 3", "expectedOutput": "[2, 1]"}
            ]
        },
        {
            "title": "Move Zeroes to End of Array",
            "slug": "move-zeroes-to-end-of-array",
            "diff": "EASY",
            "topic": "Arrays",
            "tags": ["array", "two-pointers"],
            "func": "moveZeroes",
            "params": [("int[]", "nums")],
            "return": "int[]",
            "default_val": "nums",
            "desc": "Given an integer array `nums`, move all `0`'s to the end of it while maintaining the relative order of the non-zero elements.\n\nNote that you must do this in-place without making a copy of the array.",
            "examples": [
                {"input": "nums = [0, 1, 0, 3, 12]", "output": "[1, 3, 12, 0, 0]", "explanation": "Zeros moved to end maintaining order [1, 3, 12]."},
                {"input": "nums = [0]", "output": "[0]", "explanation": "Single zero."}
            ],
            "constraints": ["1 <= nums.length <= 10^4", "-2^31 <= nums[i] <= 2^31 - 1"],
            "vis_cases": [
                {"input": "nums = [0, 1, 0, 3, 12]", "expectedOutput": "[1, 3, 12, 0, 0]"},
                {"input": "nums = [0]", "expectedOutput": "[0]"}
            ],
            "hid_cases": [
                {"input": "nums = [1, 2, 0, 0, 3]", "expectedOutput": "[1, 2, 3, 0, 0]"}
            ]
        },
        {
            "title": "Find Duplicate Number in Constant Space",
            "slug": "find-duplicate-number-constant-space",
            "diff": "MEDIUM",
            "topic": "Arrays",
            "tags": ["array", "two-pointers"],
            "func": "findDuplicate",
            "params": [("int[]", "nums")],
            "return": "int",
            "default_val": "0",
            "desc": "Given an array of integers `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive.\n\nThere is only one repeated number in `nums`, return this repeated number.",
            "examples": [
                {"input": "nums = [1, 3, 4, 2, 2]", "output": "2", "explanation": "2 is repeated."},
                {"input": "nums = [3, 1, 3, 4, 2]", "output": "3", "explanation": "3 is repeated."}
            ],
            "constraints": ["1 <= n <= 10^5", "nums.length == n + 1", "1 <= nums[i] <= n"],
            "vis_cases": [
                {"input": "nums = [1, 3, 4, 2, 2]", "expectedOutput": "2"},
                {"input": "nums = [3, 1, 3, 4, 2]", "expectedOutput": "3"}
            ],
            "hid_cases": [
                {"input": "nums = [3, 3, 3, 3, 3]", "expectedOutput": "3"}
            ]
        },
        {
            "title": "Product of Array Except Self",
            "slug": "product-of-array-except-self",
            "diff": "MEDIUM",
            "topic": "Arrays",
            "tags": ["array", "prefix-sum"],
            "func": "productExceptSelf",
            "params": [("int[]", "nums")],
            "return": "int[]",
            "default_val": "new int[]{}",
            "desc": "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.",
            "examples": [
                {"input": "nums = [1, 2, 3, 4]", "output": "[24, 12, 8, 6]", "explanation": "24=2*3*4, 12=1*3*4, 8=1*2*4, 6=1*2*3"},
                {"input": "nums = [-1, 1, 0, -3, 3]", "output": "[0, 0, 9, 0, 0]", "explanation": "Products with zero handling."}
            ],
            "constraints": ["2 <= nums.length <= 10^5", "-30 <= nums[i] <= 30"],
            "vis_cases": [
                {"input": "nums = [1, 2, 3, 4]", "expectedOutput": "[24, 12, 8, 6]"},
                {"input": "nums = [-1, 1, 0, -3, 3]", "expectedOutput": "[0, 0, 9, 0, 0]"}
            ],
            "hid_cases": [
                {"input": "nums = [2, 3, 4, 5]", "expectedOutput": "[60, 40, 30, 24]"}
            ]
        },
        {
            "title": "Container With Most Water",
            "slug": "container-with-most-water",
            "diff": "MEDIUM",
            "topic": "Arrays",
            "tags": ["array", "two-pointers"],
            "func": "maxArea",
            "params": [("int[]", "height")],
            "return": "int",
            "default_val": "0",
            "desc": "Given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
            "examples": [
                {"input": "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]", "output": "49", "explanation": "The max area is between index 1 and 8 (height 7, width 7 -> 49)."},
                {"input": "height = [1, 1]", "output": "1", "explanation": "Area is min(1, 1) * 1 = 1."}
            ],
            "constraints": ["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"],
            "vis_cases": [
                {"input": "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]", "expectedOutput": "49"},
                {"input": "height = [1, 1]", "expectedOutput": "1"}
            ],
            "hid_cases": [
                {"input": "height = [4, 3, 2, 1, 4]", "expectedOutput": "16"}
            ]
        }
    ],
    'searching': [
        {
            "title": "Binary Search Sorted Array Index",
            "slug": "binary-search-sorted-array-index",
            "diff": "EASY",
            "topic": "Searching",
            "tags": ["binary-search"],
            "func": "searchInsert",
            "params": [("int[]", "nums"), ("int", "target")],
            "return": "int",
            "default_val": "0",
            "desc": "Given a sorted array of distinct integers `nums` and a target value `target`, return the index if the target is found. If not, return the index where it would be if it were inserted in order.\n\nYou must write an algorithm with O(log n) runtime complexity.",
            "examples": [
                {"input": "nums = [1, 3, 5, 6], target = 5", "output": "2", "explanation": "5 is found at index 2."},
                {"input": "nums = [1, 3, 5, 6], target = 2", "output": "1", "explanation": "2 is missing, would be inserted at index 1."},
                {"input": "nums = [1, 3, 5, 6], target = 7", "output": "4", "explanation": "7 is missing, would be inserted at index 4."}
            ],
            "constraints": ["1 <= nums.length <= 10^4", "-10^4 <= nums[i] <= 10^4", "nums contains distinct values sorted in ascending order.", "-10^4 <= target <= 10^4"],
            "vis_cases": [
                {"input": "nums = [1, 3, 5, 6], target = 5", "expectedOutput": "2", "explanation": "Target 5 found at index 2"},
                {"input": "nums = [1, 3, 5, 6], target = 2", "expectedOutput": "1", "explanation": "Target 2 belongs at index 1"},
                {"input": "nums = [1, 3, 5, 6], target = 7", "expectedOutput": "4", "explanation": "Target 7 belongs at index 4"}
            ],
            "hid_cases": [
                {"input": "nums = [1, 3, 5, 6], target = 0", "expectedOutput": "0"},
                {"input": "nums = [1], target = 0", "expectedOutput": "0"}
            ]
        },
        {
            "title": "Search in Rotated Sorted Array",
            "slug": "search-in-rotated-sorted-array",
            "diff": "MEDIUM",
            "topic": "Searching",
            "tags": ["binary-search", "array"],
            "func": "search",
            "params": [("int[]", "nums"), ("int", "target")],
            "return": "int",
            "default_val": "-1",
            "desc": "There is an integer array `nums` sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, `nums` is possibly rotated at an unknown pivot index `k` (1 <= k < nums.length).\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.",
            "examples": [
                {"input": "nums = [4, 5, 6, 7, 0, 1, 2], target = 0", "output": "4", "explanation": "0 is at index 4."},
                {"input": "nums = [4, 5, 6, 7, 0, 1, 2], target = 3", "output": "-1", "explanation": "3 is not in nums."}
            ],
            "constraints": ["1 <= nums.length <= 5000", "-10^4 <= nums[i] <= 10^4", "All values of nums are unique."],
            "vis_cases": [
                {"input": "nums = [4, 5, 6, 7, 0, 1, 2], target = 0", "expectedOutput": "4"},
                {"input": "nums = [4, 5, 6, 7, 0, 1, 2], target = 3", "expectedOutput": "-1"}
            ],
            "hid_cases": [
                {"input": "nums = [1], target = 0", "expectedOutput": "-1"}
            ]
        },
        {
            "title": "Find First and Last Position of Element",
            "slug": "find-first-and-last-position-of-element",
            "diff": "MEDIUM",
            "topic": "Searching",
            "tags": ["binary-search"],
            "func": "searchRange",
            "params": [("int[]", "nums"), ("int", "target")],
            "return": "int[]",
            "default_val": "new int[]{-1, -1}",
            "desc": "Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value.\n\nIf `target` is not found in the array, return `[-1, -1]`.",
            "examples": [
                {"input": "nums = [5, 7, 7, 8, 8, 10], target = 8", "output": "[3, 4]", "explanation": "8 appears from index 3 to index 4."},
                {"input": "nums = [5, 7, 7, 8, 8, 10], target = 6", "output": "[-1, -1]", "explanation": "6 does not exist in array."}
            ],
            "constraints": ["0 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9", "nums is a non-decreasing array."],
            "vis_cases": [
                {"input": "nums = [5, 7, 7, 8, 8, 10], target = 8", "expectedOutput": "[3, 4]"},
                {"input": "nums = [5, 7, 7, 8, 8, 10], target = 6", "expectedOutput": "[-1, -1]"}
            ],
            "hid_cases": [
                {"input": "nums = [], target = 0", "expectedOutput": "[-1, -1]"}
            ]
        },
        {
            "title": "Search a 2D Sorted Matrix",
            "slug": "search-a-2d-sorted-matrix",
            "diff": "MEDIUM",
            "topic": "Searching",
            "tags": ["binary-search", "matrix"],
            "func": "searchMatrix",
            "params": [("int[][]", "matrix"), ("int", "target")],
            "return": "boolean",
            "default_val": "false",
            "desc": "You are given an `m x n` integer matrix `matrix` with the following two properties:\n1. Each row is sorted in non-decreasing order.\n2. The first integer of each row is greater than the last integer of the previous row.\n\nGiven an integer `target`, return `true` if `target` is in `matrix` or `false` otherwise.",
            "examples": [
                {"input": "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", "output": "true", "explanation": "3 is present in the first row."},
                {"input": "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13", "output": "false", "explanation": "13 is not in matrix."}
            ],
            "constraints": ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 100", "-10^4 <= matrix[i][j], target <= 10^4"],
            "vis_cases": [
                {"input": "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", "expectedOutput": "true"},
                {"input": "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13", "expectedOutput": "false"}
            ],
            "hid_cases": [
                {"input": "matrix = [[1]], target = 1", "expectedOutput": "true"}
            ]
        },
        {
            "title": "Find Peak Element Local Maximum",
            "slug": "find-peak-element-local-maximum",
            "diff": "MEDIUM",
            "topic": "Searching",
            "tags": ["binary-search"],
            "func": "findPeakElement",
            "params": [("int[]", "nums")],
            "return": "int",
            "default_val": "0",
            "desc": "A peak element is an element that is strictly greater than its neighbors.\n\nGiven a 0-indexed integer array `nums`, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks.",
            "examples": [
                {"input": "nums = [1, 2, 3, 1]", "output": "2", "explanation": "Index 2 is peak element 3."},
                {"input": "nums = [1, 2, 1, 3, 5, 6, 4]", "output": "5", "explanation": "Your function can return index 1 (value 2) or index 5 (value 6)."}
            ],
            "constraints": ["1 <= nums.length <= 1000", "-2^31 <= nums[i] <= 2^31 - 1"],
            "vis_cases": [
                {"input": "nums = [1, 2, 3, 1]", "expectedOutput": "2"},
                {"input": "nums = [1, 2, 1, 3, 5, 6, 4]", "expectedOutput": "5"}
            ],
            "hid_cases": [
                {"input": "nums = [1]", "expectedOutput": "0"}
            ]
        },
        {
            "title": "Koko Eating Bananas Minimum Speed",
            "slug": "koko-eating-bananas-minimum-speed",
            "diff": "MEDIUM",
            "topic": "Searching",
            "tags": ["binary-search"],
            "func": "minEatingSpeed",
            "params": [("int[]", "piles"), ("int", "h")],
            "return": "int",
            "default_val": "1",
            "desc": "Koko loves to eat bananas. There are `n` piles of bananas, the `i-th` pile has `piles[i]` bananas. The guards have gone and will come back in `h` hours.\n\nReturn the minimum integer `k` such that she can eat all the bananas within `h` hours.",
            "examples": [
                {"input": "piles = [3, 6, 7, 11], h = 8", "output": "4", "explanation": "At speed 4, Koko can finish all piles in 8 hours."},
                {"input": "piles = [30, 11, 23, 4, 20], h = 5", "output": "30", "explanation": "Speed 30 is required to finish in 5 hours."}
            ],
            "constraints": ["1 <= piles.length <= 10^4", "piles.length <= h <= 10^9", "1 <= piles[i] <= 10^9"],
            "vis_cases": [
                {"input": "piles = [3, 6, 7, 11], h = 8", "expectedOutput": "4"},
                {"input": "piles = [30, 11, 23, 4, 20], h = 5", "expectedOutput": "30"}
            ],
            "hid_cases": [
                {"input": "piles = [30, 11, 23, 4, 20], h = 6", "expectedOutput": "23"}
            ]
        }
    ],
    'strings': [
        {
            "title": "Valid Anagram Check",
            "slug": "valid-anagram-check",
            "diff": "EASY",
            "topic": "Strings",
            "tags": ["string", "hashing"],
            "func": "isAnagram",
            "params": [("String", "s"), ("String", "t")],
            "return": "boolean",
            "default_val": "false",
            "desc": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
            "examples": [
                {"input": "s = \"anagram\", t = \"nagaram\"", "output": "true", "explanation": "t contains exact same letters as s."},
                {"input": "s = \"rat\", t = \"car\"", "output": "false", "explanation": "Letter frequencies do not match."}
            ],
            "constraints": ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters."],
            "vis_cases": [
                {"input": "s = \"anagram\", t = \"nagaram\"", "expectedOutput": "true"},
                {"input": "s = \"rat\", t = \"car\"", "expectedOutput": "false"}
            ],
            "hid_cases": [
                {"input": "s = \"a\", t = \"a\"", "expectedOutput": "true"}
            ]
        },
        {
            "title": "Valid Palindrome Phrase",
            "slug": "valid-palindrome-phrase",
            "diff": "EASY",
            "topic": "Strings",
            "tags": ["string", "two-pointers"],
            "func": "isPalindrome",
            "params": [("String", "s")],
            "return": "boolean",
            "default_val": "true",
            "desc": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
            "examples": [
                {"input": "s = \"A man, a plan, a canal: Panama\"", "output": "true", "explanation": "\"amanaplanacanalpanama\" is a palindrome."},
                {"input": "s = \"race a car\"", "output": "false", "explanation": "\"raceacar\" is not a palindrome."}
            ],
            "constraints": ["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters."],
            "vis_cases": [
                {"input": "s = \"A man, a plan, a canal: Panama\"", "expectedOutput": "true"},
                {"input": "s = \"race a car\"", "expectedOutput": "false"}
            ],
            "hid_cases": [
                {"input": "s = \" \"", "expectedOutput": "true"}
            ]
        },
        {
            "title": "Longest Substring Without Repeating Characters",
            "slug": "longest-substring-without-repeating-characters",
            "diff": "MEDIUM",
            "topic": "Strings",
            "tags": ["string", "sliding-window"],
            "func": "lengthOfLongestSubstring",
            "params": [("String", "s")],
            "return": "int",
            "default_val": "0",
            "desc": "Given a string `s`, find the length of the longest substring without repeating characters.",
            "examples": [
                {"input": "s = \"abcabcbb\"", "output": "3", "explanation": "The answer is \"abc\", with length 3."},
                {"input": "s = \"bbbbb\"", "output": "1", "explanation": "The answer is \"b\", with length 1."},
                {"input": "s = \"pwwkew\"", "output": "3", "explanation": "The answer is \"wke\", with length 3."}
            ],
            "constraints": ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
            "vis_cases": [
                {"input": "s = \"abcabcbb\"", "expectedOutput": "3"},
                {"input": "s = \"bbbbb\"", "expectedOutput": "1"},
                {"input": "s = \"pwwkew\"", "expectedOutput": "3"}
            ],
            "hid_cases": [
                {"input": "s = \"\"", "expectedOutput": "0"}
            ]
        }
    ],
    'stacks': [
        {
            "title": "Valid Parentheses Matching",
            "slug": "valid-parentheses-matching",
            "diff": "EASY",
            "topic": "Stack",
            "tags": ["stack", "string"],
            "func": "isValid",
            "params": [("String", "s")],
            "return": "boolean",
            "default_val": "true",
            "desc": "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
            "examples": [
                {"input": "s = \"()\"", "output": "true", "explanation": "Simple pair."},
                {"input": "s = \"()[]{}\"", "output": "true", "explanation": "Multiple valid pairs."},
                {"input": "s = \"(]\"", "output": "false", "explanation": "Mismatched bracket types."}
            ],
            "constraints": ["1 <= s.length <= 10^4", "s consists of brackets only '()[]{}'."],
            "vis_cases": [
                {"input": "s = \"()\"", "expectedOutput": "true"},
                {"input": "s = \"()[]{}\"", "expectedOutput": "true"},
                {"input": "s = \"(]\"", "expectedOutput": "false"}
            ],
            "hid_cases": [
                {"input": "s = \"([)]\"", "expectedOutput": "false"}
            ]
        }
    ],
    'dynamic_programming': [
        {
            "title": "Coin Change Minimum Coins",
            "slug": "coin-change-minimum-coins",
            "diff": "MEDIUM",
            "topic": "Dynamic Programming",
            "tags": ["dp"],
            "func": "coinChange",
            "params": [("int[]", "coins"), ("int", "amount")],
            "return": "int",
            "default_val": "-1",
            "desc": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.",
            "examples": [
                {"input": "coins = [1, 2, 5], amount = 11", "output": "3", "explanation": "11 = 5 + 5 + 1"},
                {"input": "coins = [2], amount = 3", "output": "-1", "explanation": "Cannot make amount 3 with coin 2."}
            ],
            "constraints": ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
            "vis_cases": [
                {"input": "coins = [1, 2, 5], amount = 11", "expectedOutput": "3"},
                {"input": "coins = [2], amount = 3", "expectedOutput": "-1"}
            ],
            "hid_cases": [
                {"input": "coins = [1], amount = 0", "expectedOutput": "0"}
            ]
        }
    ]
}

def map_type_to_lang(type_str, lang):
    if lang == 'java':
        return type_str
    elif lang == 'cpp':
        if type_str == 'int[]': return 'vector<int>&'
        if type_str == 'int[][]': return 'vector<vector<int>>&'
        if type_str == 'String': return 'string'
        if type_str == 'String[]': return 'vector<string>&'
        if type_str == 'boolean': return 'bool'
        return type_str
    elif lang == 'python':
        if type_str == 'int[]': return 'List[int]'
        if type_str == 'int[][]': return 'List[List[int]]'
        if type_str == 'String': return 'str'
        if type_str == 'String[]': return 'List[str]'
        if type_str == 'boolean': return 'bool'
        return type_str
    elif lang in ['javascript', 'typescript']:
        if type_str == 'int[]': return 'number[]'
        if type_str == 'int[][]': return 'number[][]'
        if type_str == 'String': return 'string'
        if type_str == 'String[]': return 'string[]'
        if type_str == 'boolean': return 'boolean'
        return type_str
    return type_str

def generate_starter_code(func, params, return_type, default_val):
    # Java
    j_params = ", ".join([f"{map_type_to_lang(t, 'java')} {n}" for t, n in params])
    j_ret = map_type_to_lang(return_type, 'java')
    j_def = default_val

    # CPP
    c_params = ", ".join([f"{map_type_to_lang(t, 'cpp')} {n}" for t, n in params])
    c_ret = map_type_to_lang(return_type, 'cpp')
    c_def = "0" if default_val in ["0", "-1"] else "false" if default_val == "false" else "{}"

    # Python
    p_params = ", ".join([f"{n}: {map_type_to_lang(t, 'python')}" for t, n in params])
    p_ret = map_type_to_lang(return_type, 'python')
    p_def = "0" if default_val in ["0", "-1"] else "False" if default_val == "false" else "True" if default_val == "true" else "[]"

    # JS
    js_params = ", ".join([n for _, n in params])
    js_doc_params = "\n * ".join([f"@param {{{map_type_to_lang(t, 'javascript')}}} {n}" for t, n in params])
    js_ret = map_type_to_lang(return_type, 'javascript')

    # TS
    ts_params = ", ".join([f"{n}: {map_type_to_lang(t, 'typescript')}" for t, n in params])

    return {
        "java": f"class Solution {{\n    public {j_ret} {func}({j_params}) {{\n        // Write your solution here\n        return {j_def};\n    }}\n}}",
        "cpp": f"class Solution {{\npublic:\n    {c_ret} {func}({c_params}) {{\n        // Write your solution here\n        return {c_def};\n    }}\n}};",
        "python": f"class Solution:\n    def {func}(self, {p_params}) -> {p_ret}:\n        # Write your solution here\n        return {p_def}",
        "javascript": f"/**\n * {js_doc_params}\n * @return {{{js_ret}}}\n */\nfunction {func}({js_params}) {{\n    // Write your solution here\n    return {j_def.replace('new int[]{}', '[]').replace('new int[]{0, 0}', '[0, 0]')};\n}}",
        "typescript": f"function {func}({ts_params}): {map_type_to_lang(return_type, 'typescript')} {{\n    // Write your solution here\n    return {j_def.replace('new int[]{}', '[]').replace('new int[]{0, 0}', '[0, 0]')};\n}}"
    }

print("Generator script created successfully!")
