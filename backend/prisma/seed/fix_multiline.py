import os
import re

TOPICS_DIR = 'backend/prisma/seed/topics'

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match single-quoted strings that contain newlines and convert to template literals or replace newlines with \n
    def replace_multiline_sq(match):
        s = match.group(1)
        s_clean = s.replace('\n', ' ')
        return f"'{s_clean}'"

    # Replace 'text \n text' with 'text text'
    new_content = re.sub(r"'([^'\n]*\n[^']*)'", replace_multiline_sq, content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

if __name__ == '__main__':
    for fname in sorted(os.listdir(TOPICS_DIR)):
        if fname.endswith('.ts'):
            fix_file(os.path.join(TOPICS_DIR, fname))
    print("Fixed multiline single quotes.")
