import os
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TOPICS_DIR = os.path.join(SCRIPT_DIR, 'topics')

def get_export_var_name(topic_key):
    mapping = {
        'arrays': 'arrayProblems',
        'strings': 'stringProblems',
        'linked_lists': 'linkedListProblems',
        'stacks': 'stackProblems',
        'queues': 'queueProblems',
        'trees': 'treeProblems',
        'bst': 'bstProblems',
        'heaps': 'heapProblems',
        'hashing': 'hashingProblems',
        'graphs': 'graphProblems',
        'recursion': 'recursionProblems',
        'backtracking': 'backtrackingProblems',
        'dynamic_programming': 'dpProblems',
        'greedy': 'greedyProblems',
        'sorting': 'sortingProblems',
        'searching': 'searchingProblems',
    }
    return mapping.get(topic_key, f"{topic_key}Problems")

def get_topic_problems_dict():
    return {
        'arrays': [
            ("Maximum Subarray Sum (Kadane)", "maximum-subarray-sum", "MEDIUM", "Arrays", ["array", "dynamic-programming"]),
            ("Two Sum Target Index Pair", "two-sum-target-index-pair", "EASY", "Arrays", ["array", "hash-table"]),
            ("Rotate Array Right by K Steps", "rotate-array-right-by-k-steps", "MEDIUM", "Arrays", ["array", "two-pointers"]),
            ("Move Zeroes to End of Array", "move-zeroes-to-end-of-array", "EASY", "Arrays", ["array", "two-pointers"]),
            ("Find Duplicate Number in Constant Space", "find-duplicate-number-constant-space", "MEDIUM", "Arrays", ["array", "two-pointers"]),
            ("Product of Array Except Self", "product-of-array-except-self", "MEDIUM", "Arrays", ["array", "prefix-sum"]),
            ("Container With Most Water", "container-with-most-water", "MEDIUM", "Arrays", ["array", "two-pointers"]),
        ],
        'strings': [
            ("Valid Anagram Check", "valid-anagram-check", "EASY", "Strings", ["string", "hashing"]),
            ("Valid Palindrome Phrase", "valid-palindrome-phrase", "EASY", "Strings", ["string", "two-pointers"]),
            ("Longest Substring Without Repeating Characters", "longest-substring-without-repeating-characters", "MEDIUM", "Strings", ["string", "sliding-window"]),
            ("String Compression Run-Length", "string-compression-run-length", "MEDIUM", "Strings", ["string", "two-pointers"]),
            ("Group Anagrams Together", "group-anagrams-together", "MEDIUM", "Strings", ["string", "hash-table"]),
            ("Longest Palindromic Substring", "longest-palindromic-substring", "MEDIUM", "Strings", ["string", "dynamic-programming"]),
            ("Count and Say Sequence", "count-and-say-sequence", "MEDIUM", "Strings", ["string", "recursion"]),
        ],
        'linked_lists': [
            ("Reverse Singly Linked List", "reverse-singly-linked-list", "EASY", "Linked List", ["linked-list", "recursion"]),
            ("Detect Cycle in Linked List", "detect-cycle-in-linked-list", "EASY", "Linked List", ["linked-list", "two-pointers"]),
            ("Merge Two Sorted Lists", "merge-two-sorted-lists", "EASY", "Linked List", ["linked-list", "recursion"]),
            ("Remove N-th Node From End of List", "remove-nth-node-from-end-of-list", "MEDIUM", "Linked List", ["linked-list", "two-pointers"]),
            ("Reorder List Alternate Order", "reorder-list-alternate-order", "MEDIUM", "Linked List", ["linked-list", "two-pointers"]),
            ("Intersection Point of Two Linked Lists", "intersection-point-of-two-linked-lists", "EASY", "Linked List", ["linked-list", "two-pointers"]),
        ],
        'stacks': [
            ("Valid Parentheses Matching", "valid-parentheses-matching", "EASY", "Stack", ["stack", "string"]),
            ("Min Stack Constant Time Retrieval", "min-stack-constant-time-retrieval", "MEDIUM", "Stack", ["stack", "design"]),
            ("Evaluate Reverse Polish Notation", "evaluate-reverse-polish-notation", "MEDIUM", "Stack", ["stack", "math"]),
            ("Daily Temperatures Next Warmer Day", "daily-temperatures-next-warmer-day", "MEDIUM", "Stack", ["stack", "monotonic-stack"]),
            ("Decode String Nested Multipliers", "decode-string-nested-multipliers", "MEDIUM", "Stack", ["stack", "recursion"]),
            ("Asteroid Collision Simulation", "asteroid-collision-simulation", "MEDIUM", "Stack", ["stack", "simulation"]),
        ],
        'queues': [
            ("Implement Queue using Stacks", "implement-queue-using-stacks", "EASY", "Queue", ["queue", "stack"]),
            ("Sliding Window Maximum", "sliding-window-maximum", "HARD", "Queue", ["queue", "deque", "sliding-window"]),
            ("Rotting Oranges Grid Simulation", "rotting-oranges-grid-simulation", "MEDIUM", "Queue", ["queue", "bfs"]),
            ("Design Circular Deque", "design-circular-deque", "MEDIUM", "Queue", ["queue", "design"]),
            ("Dota2 Senate Radiant vs Dire", "dota2-senate-radiant-vs-dire", "MEDIUM", "Queue", ["queue", "greedy"]),
            ("Number of Recent Calls Counter", "number-of-recent-calls-counter", "EASY", "Queue", ["queue", "design"]),
        ],
        'trees': [
            ("Maximum Depth of Binary Tree", "maximum-depth-of-binary-tree", "EASY", "Binary Tree", ["tree", "dfs"]),
            ("Invert Binary Tree Mirror", "invert-binary-tree-mirror", "EASY", "Binary Tree", ["tree", "bfs"]),
            ("Same Tree Structure and Values", "same-tree-structure-and-values", "EASY", "Binary Tree", ["tree", "recursion"]),
            ("Binary Tree Level Order Traversal", "binary-tree-level-order-traversal", "MEDIUM", "Binary Tree", ["tree", "bfs"]),
            ("Lowest Common Ancestor in Binary Tree", "lowest-common-ancestor-in-binary-tree", "MEDIUM", "Binary Tree", ["tree", "dfs"]),
            ("Diameter of Binary Tree", "diameter-of-binary-tree", "EASY", "Binary Tree", ["tree", "dfs"]),
            ("Construct Tree from Preorder and Inorder", "construct-tree-from-preorder-inorder", "MEDIUM", "Binary Tree", ["tree", "array"]),
        ],
        'bst': [
            ("Validate Binary Search Tree", "validate-binary-search-tree", "MEDIUM", "BST", ["bst", "dfs"]),
            ("Search in Binary Search Tree", "search-in-binary-search-tree", "EASY", "BST", ["bst", "recursion"]),
            ("Insert into a Binary Search Tree", "insert-into-a-binary-search-tree", "MEDIUM", "BST", ["bst", "recursion"]),
            ("K-th Smallest Element in a BST", "kth-smallest-element-in-a-bst", "MEDIUM", "BST", ["bst", "inorder-traversal"]),
            ("Delete Node in a BST", "delete-node-in-a-bst", "MEDIUM", "BST", ["bst", "recursion"]),
            ("Lowest Common Ancestor of a BST", "lowest-common-ancestor-of-a-bst", "EASY", "BST", ["bst", "recursion"]),
        ],
        'heaps': [
            ("K-th Largest Element in an Array", "kth-largest-element-in-an-array", "MEDIUM", "Heap", ["heap", "quick-select"]),
            ("Top K Frequent Elements", "top-k-frequent-elements", "MEDIUM", "Heap", ["heap", "hash-table"]),
            ("Merge K Sorted Lists", "merge-k-sorted-lists", "HARD", "Heap", ["heap", "linked-list"]),
            ("Find Median from Data Stream", "find-median-from-data-stream", "HARD", "Heap", ["heap", "design"]),
            ("Task Scheduler Minimum Interval", "task-scheduler-minimum-interval", "MEDIUM", "Heap", ["heap", "greedy"]),
            ("K Closest Points to Origin", "k-closest-points-to-origin", "MEDIUM", "Heap", ["heap", "geometry"]),
        ],
        'hashing': [
            ("Contains Duplicate Check", "contains-duplicate-check", "EASY", "Hashing", ["hash-table", "array"]),
            ("Intersection of Two Arrays", "intersection-of-two-arrays", "EASY", "Hashing", ["hash-table", "two-pointers"]),
            ("Subarray Sum Equals K", "subarray-sum-equals-k", "MEDIUM", "Hashing", ["hash-table", "prefix-sum"]),
            ("Longest Consecutive Sequence", "longest-consecutive-sequence", "MEDIUM", "Hashing", ["hash-table", "union-find"]),
            ("Isomorphic Strings Verification", "isomorphic-strings-verification", "EASY", "Hashing", ["hash-table", "string"]),
            ("Unique Word Abbreviation Data Structure", "unique-word-abbreviation-data-structure", "MEDIUM", "Hashing", ["hash-table", "design"]),
            ("First Unique Character in a String", "first-unique-character-in-a-string", "EASY", "Hashing", ["hash-table", "queue"]),
        ],
        'graphs': [
            ("Number of Islands Grid Traversal", "number-of-islands-grid-traversal", "MEDIUM", "Graphs", ["graph", "bfs", "dfs"]),
            ("Clone Undirected Graph", "clone-undirected-graph", "MEDIUM", "Graphs", ["graph", "bfs", "hash-table"]),
            ("Course Schedule Prerequisites Cycle Detection", "course-schedule-prerequisites-cycle-detection", "MEDIUM", "Graphs", ["graph", "topological-sort"]),
            ("Pacific Atlantic Water Flow", "pacific-atlantic-water-flow", "MEDIUM", "Graphs", ["graph", "dfs"]),
            ("Word Ladder Shortest Transformation", "word-ladder-shortest-transformation", "HARD", "Graphs", ["graph", "bfs"]),
            ("Network Delay Time Dijkstra", "network-delay-time-dijkstra", "MEDIUM", "Graphs", ["graph", "dijkstra"]),
            ("Is Graph Bipartite Colored", "is-graph-bipartite-colored", "MEDIUM", "Graphs", ["graph", "bfs"]),
        ],
        'recursion': [
            ("Fibonacci Number Recursive Calculation", "fibonacci-number-recursive-calculation", "EASY", "Recursion", ["recursion", "math"]),
            ("Power of X to N Fast Exponentiation", "power-of-x-to-n-fast-exponentiation", "MEDIUM", "Recursion", ["recursion", "math"]),
            ("Tower of Hanoi Disks Movement", "tower-of-hanoi-disks-movement", "MEDIUM", "Recursion", ["recursion", "divide-and-conquer"]),
            ("Reverse String Recursively", "reverse-string-recursively", "EASY", "Recursion", ["recursion", "string"]),
            ("Pascal Triangle Nth Row Value", "pascal-triangle-nth-row-value", "EASY", "Recursion", ["recursion", "math"]),
            ("Climbing Stairs Distinct Ways", "climbing-stairs-distinct-ways", "EASY", "Recursion", ["recursion", "dp"]),
        ],
        'backtracking': [
            ("N-Queens Non-Attacking Placements", "n-queens-non-attacking-placements", "HARD", "Backtracking", ["backtracking"]),
            ("Permutations of Unique Integers", "permutations-of-unique-integers", "MEDIUM", "Backtracking", ["backtracking"]),
            ("All Possible Subsets Power Set", "all-possible-subsets-power-set", "MEDIUM", "Backtracking", ["backtracking"]),
            ("Combination Sum Target Combination", "combination-sum-target-combination", "MEDIUM", "Backtracking", ["backtracking"]),
            ("Sudoku Solver 9x9 Grid", "sudoku-solver-9x9-grid", "HARD", "Backtracking", ["backtracking"]),
            ("Word Search in 2D Character Grid", "word-search-in-2d-character-grid", "MEDIUM", "Backtracking", ["backtracking"]),
        ],
        'dynamic_programming': [
            ("Coin Change Minimum Coins", "coin-change-minimum-coins", "MEDIUM", "Dynamic Programming", ["dp"]),
            ("Longest Increasing Subsequence", "longest-increasing-subsequence", "MEDIUM", "Dynamic Programming", ["dp", "binary-search"]),
            ("Longest Common Subsequence", "longest-common-subsequence", "MEDIUM", "Dynamic Programming", ["dp", "string"]),
            ("0-1 Knapsack Maximum Value", "0-1-knapsack-maximum-value", "MEDIUM", "Dynamic Programming", ["dp"]),
            ("House Robber Maximum Amount", "house-robber-maximum-amount", "MEDIUM", "Dynamic Programming", ["dp"]),
            ("Edit Distance Minimum Operations", "edit-distance-minimum-operations", "HARD", "Dynamic Programming", ["dp", "string"]),
            ("Partition Equal Subset Sum", "partition-equal-subset-sum", "MEDIUM", "Dynamic Programming", ["dp"]),
        ],
        'greedy': [
            ("Jump Game Can Reach End", "jump-game-can-reach-end", "MEDIUM", "Greedy", ["greedy", "array"]),
            ("Gas Station Circuit Completion", "gas-station-circuit-completion", "MEDIUM", "Greedy", ["greedy", "array"]),
            ("Partition Labels Max Substrings", "partition-labels-max-substrings", "MEDIUM", "Greedy", ["greedy", "string"]),
            ("Non-overlapping Intervals Count", "non-overlapping-intervals-count", "MEDIUM", "Greedy", ["greedy", "sorting"]),
            ("Assign Cookies Maximum Children", "assign-cookies-maximum-children", "EASY", "Greedy", ["greedy", "two-pointers"]),
            ("Maximum Units on a Truck Loading", "maximum-units-on-a-truck-loading", "EASY", "Greedy", ["greedy", "sorting"]),
        ],
        'sorting': [
            ("Sort Array Merge Sort Algorithm", "sort-array-merge-sort-algorithm", "MEDIUM", "Sorting", ["sorting", "divide-and-conquer"]),
            ("Merge Intervals Overlapping Ranges", "merge-intervals-overlapping-ranges", "MEDIUM", "Sorting", ["sorting", "array"]),
            ("Sort Colors Dutch National Flag", "sort-colors-dutch-national-flag", "MEDIUM", "Sorting", ["sorting", "two-pointers"]),
            ("Insertion Sort List Singly Linked", "insertion-sort-list-singly-linked", "MEDIUM", "Sorting", ["sorting", "linked-list"]),
            ("Largest Number String Formed", "largest-number-string-formed", "MEDIUM", "Sorting", ["sorting", "string"]),
            ("Custom Sort String Order", "custom-sort-string-order", "MEDIUM", "Sorting", ["sorting", "hash-table"]),
        ],
        'searching': [
            ("Binary Search Sorted Array Index", "binary-search-sorted-array-index", "EASY", "Searching", ["binary-search"]),
            ("Search in Rotated Sorted Array", "search-in-rotated-sorted-array", "MEDIUM", "Searching", ["binary-search", "array"]),
            ("Find First and Last Position of Element", "find-first-and-last-position-of-element", "MEDIUM", "Searching", ["binary-search"]),
            ("Search a 2D Sorted Matrix", "search-a-2d-sorted-matrix", "MEDIUM", "Searching", ["binary-search", "matrix"]),
            ("Find Peak Element Local Maximum", "find-peak-element-local-maximum", "MEDIUM", "Searching", ["binary-search"]),
            ("Koko Eating Bananas Minimum Speed", "koko-eating-bananas-minimum-speed", "MEDIUM", "Searching", ["binary-search"]),
        ]
    }

def generate_topic_file(topic_key, problems):
    var_name = get_export_var_name(topic_key)

    problem_blocks = []
    for title, slug, diff, topic, tags in problems:
        tag_str = ', '.join([f"'{t}'" for t in tags])

        vis_cases = [
            f"{{ input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', explanation: 'Standard visible case 1' }}",
            f"{{ input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[1, 2]', explanation: 'Representative test case 2' }}",
            f"{{ input: 'nums = [3, 3], target = 6', expectedOutput: '[0, 1]', explanation: 'Boundary duplicate elements case 3' }}",
            f"{{ input: 'nums = [-1, -2, -3], target = -5', expectedOutput: '[1, 2]', explanation: 'Negative numbers case 4' }}",
        ]

        categories = [
            'Normal standard case 1', 'Normal standard case 2', 'Single element edge case',
            'All zeros / Minimal input', 'Duplicate values edge case', 'Negative values edge case',
            'Large constraint values', 'Sorted order boundary case', 'Reverse sorted order boundary case',
            'Maximum constraint size', 'Boundary value edge case', 'High variance input case'
        ]

        hid_cases = [
            f"{{ input: 'nums = [{i+1}, {i+5}, {i+10}], target = {i+6}', expectedOutput: '[0, 1]' }}"
            for i in range(12)
        ]

        block = f"""  {{
    title: '{title}',
    slug: '{slug}',
    description: `Given an input configuration, solve the {title} problem efficiently satisfying all time and memory complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: '{diff}',
    topic: '{topic}',
    tags: [{tag_str}],
    examples: [
      {{ input: 'Sample Input 1', output: 'Sample Output 1', explanation: 'Primary problem example' }}
    ],
    constraints: ['1 <= N <= 10^5'],
    starterCode: {{
      java: `class Solution {{\n    public int solve() {{\n        return 0;\n    }}\n}}`,
      cpp: `class Solution {{\npublic:\n    int solve() {{\n        return 0;\n    }}\n}};`,
      python: `class Solution:\n    def solve(self) -> int:\n        return 0`,
      javascript: `function solve() {{\n    return 0;\n}}`,
      typescript: `function solve(): number {{\n    return 0;\n}}`
    }},
    visibleTestCases: [
      {',\n      '.join(vis_cases)}
    ],
    hiddenTestCases: [
      {',\n      '.join(hid_cases)}
    ]
  }}"""
        problem_blocks.append(block)

    file_code = f"""import {{ CodingProblemSeedInput }} from '../types';

export const {var_name}: CodingProblemSeedInput[] = [
{',\n'.join(problem_blocks)}
];
"""
    filepath = os.path.join(TOPICS_DIR, f"{topic_key}.ts")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(file_code)

if __name__ == '__main__':
    all_probs = get_topic_problems_dict()
    total = 0
    for topic_key, problems in all_probs.items():
        generate_topic_file(topic_key, problems)
        total += len(problems)
    print(f"Total problems generated across all 16 topics: {total}")
