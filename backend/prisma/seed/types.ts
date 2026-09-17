export interface CodingProblemSeedInput {
  title: string;
  slug: string;
  description: string;
  source?: string;
  license?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topic: string; // Arrays, Strings, Linked List, Stack, Queue, Binary Tree, BST, Heap, Hashing, Graphs, Recursion, Backtracking, Dynamic Programming, Greedy, Sorting, Searching
  tags: string[];
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  supportedLanguages?: string[];
  starterCode: {
    java: string;
    cpp: string;
    python: string;
    javascript: string;
    typescript: string;
  };
  visibleTestCases: Array<{
    input: string;
    expectedOutput: string;
    explanation?: string;
  }>;
  hiddenTestCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
  timeLimitMs?: number;
  memoryLimitMb?: number;
}
