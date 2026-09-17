import os
import re
import json

TOPICS_DIR = 'backend/prisma/seed/topics'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match problem objects
    # We will parse problems and add test cases if hidden count < 10
    print(f"Checking {os.path.basename(filepath)}...")

if __name__ == '__main__':
    for fname in sorted(os.listdir(TOPICS_DIR)):
        if fname.endswith('.ts'):
            process_file(os.path.join(TOPICS_DIR, fname))
