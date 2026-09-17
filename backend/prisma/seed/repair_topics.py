import os
import re

TOPICS_DIR = 'backend/prisma/seed/topics'

def repair_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Repair broken test case inputs like:
    # { input: 'nums = [2, 7, 11, 15,
    # { input: ...
    # ], target = 9', expectedOutput: '[0, 1]' },

    # Regex to fix broken test case insertions
    pattern = r"\{\s*input:\s*'([^']*\n[^']*)'\s*,"
    # Let's clean up any line containing broken test case insertions
    lines = content.splitlines()
    repaired_lines = []
    skip = False

    for line in lines:
        if "explanation: 'Standard representative test case'" in line or "explanation: 'Edge case containing negative/boundary values'" in line:
            continue
        if "expectedOutput: '0'" in line and ("{ input: '[1]'" in line or "{ input: '[5, 5]'" in line or "{ input: '[0, 0, 0]'" in line or "{ input: '[-1, -5, -10, -20]'" in line or "{ input: '[100000, 500000, 1000000]'" in line or "{ input: '[3, 3, 3, 3, 3, 3]'" in line or "{ input: '[1, -1, 1, -1, 1, -1]'" in line or "{ input: '[1, 2, 3, 4, 5, 6, 7, 8]'" in line or "{ input: '[10, 9, 8, 7, 6, 5, 4]'" in line or "{ input: '[100, -50, 200, -10, 300, -400, 500]'" in line or "{ input: '[-1000, 500, 0, -250, 125, 75]'" in line or '""' in line or '"a"' in line or '"aa"' in line or '"z"' in line or '"abcdefghijk"' in line or '"aaaaa"' in line or '"ababab"' in line or '"abcdefg"' in line or '"gfedcba"' in line or '"racecar"' in line or '"leetcode"' in line):
            continue
        repaired_lines.append(line)

    repaired_content = '\n'.join(repaired_lines)
    # Fix broken multiline inputs like: { input: 'nums = [2, 7, 11, 15,\n], target = 9', expectedOutput: '[0, 1]' }
    repaired_content = re.sub(r"\{\s*input:\s*'([^'\n]*),\n\s*\],", r"{ input: '\1,", repaired_content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(repaired_content)

if __name__ == '__main__':
    for fname in sorted(os.listdir(TOPICS_DIR)):
        if fname.endswith('.ts'):
            repair_file(os.path.join(TOPICS_DIR, fname))
    print("Repaired files.")
