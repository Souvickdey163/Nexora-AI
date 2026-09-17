import os
import re

TOPICS_DIR = 'backend/prisma/seed/topics'

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix unterminated string literals like: input: 'nums = [1, '
    # or input: 'nums = [100, -50, 200, -10, 300, -400, 500]', expectedOutput: '2' }'

    # Remove bad lines that have unterminated quotes or malformed syntax inside hiddenTestCases / visibleTestCases
    # A valid test case line looks like: { input: '...', expectedOutput: '...' },

    lines = content.splitlines()
    cleaned_lines = []

    for line in lines:
        # If line contains { input: ..., check if quotes are balanced
        if 'input:' in line:
            # Check single quote count
            single_quotes = line.count("'")
            if single_quotes % 2 != 0:
                # Fix line by escaping or cleaning
                line = re.sub(r"input:\s*'(.*?)'", r'input: "\1"', line)
                line = re.sub(r"expectedOutput:\s*'(.*?)'", r'expectedOutput: "\1"', line)
                line = re.sub(r"explanation:\s*'(.*?)'", r'explanation: "\1"', line)

        cleaned_lines.append(line)

    new_content = '\n'.join(cleaned_lines)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

if __name__ == '__main__':
    for fname in sorted(os.listdir(TOPICS_DIR)):
        if fname.endswith('.ts'):
            clean_file(os.path.join(TOPICS_DIR, fname))
    print("Cleaned quotes in topic files.")
