import os
import re
import json

TOPICS_DIR = 'backend/prisma/seed/topics'

def process_file(fname):
    filepath = os.path.join(TOPICS_DIR, fname)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match each problem block safely by regex
    # Each problem block is in export const ... = [ { ... }, { ... } ];
    # We can clean up any syntax issues in hiddenTestCases or visibleTestCases
    # By making sure each test case object has proper quotes and trailing commas.

    # 1. Remove duplicate commas ",,"
    content = content.replace(',,', ',')

    # 2. Ensure visibleTestCases and hiddenTestCases have valid array formatting
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    for fname in sorted(os.listdir(TOPICS_DIR)):
        if fname.endswith('.ts'):
            process_file(fname)
    print("Pre-cleaned topic files.")
