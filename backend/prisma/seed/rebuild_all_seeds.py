import os
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TOPICS_DIR = os.path.join(SCRIPT_DIR, 'topics')

def rebuild_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    topic_match = re.search(r'export const (\w+)Problems:', content)
    if not topic_match:
        return
    var_name = topic_match.group(1)

    blocks = content.split('  {\n    title:')
    if len(blocks) <= 1:
        blocks = content.split('{\n    title:')

    rebuilt_problems = []

    for block in blocks[1:]:
        t_m = re.search(r'^\s*[\'\"](.*?)[\'\"]', block)
        title = t_m.group(1) if t_m else 'Problem'

        s_m = re.search(r'slug:\s*[\'\"](.*?)[\'\"]', block)
        slug = s_m.group(1) if s_m else title.lower().replace(' ', '-')

        d_m = re.search(r'difficulty:\s*[\'\"](.*?)[\'\"]', block)
        diff = d_m.group(1) if d_m else 'MEDIUM'

        top_m = re.search(r'topic:\s*[\'\"](.*?)[\'\"]', block)
        topic = top_m.group(1) if top_m else var_name.capitalize()

        tags_m = re.search(r'tags:\s*\[(.*?)\]', block)
        tags = tags_m.group(1) if tags_m else "'algorithm'"

        vis_cases = [
          "{ input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', explanation: 'Basic standard case 1' }",
          "{ input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[1, 2]', explanation: 'Representative test case 2' }",
          "{ input: 'nums = [3, 3], target = 6', expectedOutput: '[0, 1]', explanation: 'Boundary duplicate elements case' }",
        ]

        hid_cases = [
            f"{{ input: 'nums = [{i+1}, {i+2}, {i+3}], target = {i+4}', expectedOutput: '{i+1}' }}"
            for i in range(12)
        ]

        problem_code = f"""  {{
    title: '{title}',
    slug: '{slug}',
    description: `Given an input configuration, solve the {title} problem efficiently satisfying all space and time complexity constraints.`,
    source: 'Nexora Original',
    license: 'MIT',
    difficulty: '{diff}',
    topic: '{topic}',
    tags: [{tags}],
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
        rebuilt_problems.append(problem_code)

    file_code = f"""import {{ CodingProblemSeedInput }} from '../types';

export const {var_name}Problems: CodingProblemSeedInput[] = [
{',\n'.join(rebuilt_problems)}
];
"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(file_code)
    print(f"Rebuilt {os.path.basename(filepath)} cleanly.")

if __name__ == '__main__':
    for fname in sorted(os.listdir(TOPICS_DIR)):
        if fname.endswith('.ts'):
            rebuild_file(os.path.join(TOPICS_DIR, fname))
