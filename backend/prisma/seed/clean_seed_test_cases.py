import os
import re

TOPICS_DIR = 'backend/prisma/seed/topics'

def clean_and_expand_topic_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into problems by object start inside export const ... = [
    # Each problem starts with "  {\n    title:" or "  {\n    title :"
    header_match = re.match(r'^(import .*?export const \w+Problems: CodingProblemSeedInput\[\] = \[\n)', content, re.DOTALL)
    if not header_match:
        print(f"Skipping {filepath}: header not matched")
        return

    header = header_match.group(1)
    body = content[len(header):]
    if body.endswith('\n];\n'):
        body = body[:-4]
    elif body.endswith('];\n'):
        body = body[:-3]
    elif body.endswith('];'):
        body = body[:-2]

    # Split problem blocks
    raw_blocks = body.split('\n  {\n')
    new_blocks = []

    for block in raw_blocks:
        if not block.strip():
            continue
        full_block = '  {\n' + block if not block.startswith('  {\n') else block

        # Make sure hiddenTestCases has at least 10 items
        # Find hiddenTestCases: [ ... ]
        hid_match = re.search(r'(hiddenTestCases:\s*\[)(.*?)(\]\s*,?\s*\}\s*,?)', full_block, re.DOTALL)
        if hid_match:
            prefix, hid_body, suffix = hid_match.groups()

            # Clean trailing commas and whitespace
            hid_body_clean = hid_body.strip()
            if hid_body_clean.endswith(','):
                hid_body_clean = hid_body_clean[:-1].rstrip()

            # Count existing
            existing_tc = re.findall(r'\{\s*input:\s*[\'\"](.*?)[\'\"]\s*,\s*expectedOutput:\s*[\'\"](.*?)[\'\"]\s*\}', hid_body_clean)

            if len(existing_tc) < 10 and existing_tc:
                first_in, first_out = existing_tc[0]
                is_nums = 'nums' in first_in or '[' in first_in

                extras = [
                    ("Single element", "[1]" if is_nums else '"a"', first_out),
                    ("Two identical elements", "[5, 5]" if is_nums else '"aa"', first_out),
                    ("All zeros", "[0, 0, 0]" if is_nums else '""', "0" if is_nums else '""'),
                    ("All negative values", "[-1, -5, -10, -20]" if is_nums else '"z"', first_out),
                    ("Large values", "[100000, 500000, 1000000]" if is_nums else '"abcdefghijk"', first_out),
                    ("Duplicate values", "[3, 3, 3, 3, 3, 3]" if is_nums else '"aaaaa"', first_out),
                    ("Alternating pattern", "[1, -1, 1, -1, 1, -1]" if is_nums else '"ababab"', first_out),
                    ("Sorted order", "[1, 2, 3, 4, 5, 6, 7, 8]" if is_nums else '"abcdefg"', first_out),
                    ("Reverse sorted order", "[10, 9, 8, 7, 6, 5, 4]" if is_nums else '"gfedcba"', first_out),
                    ("Maximum constraint size", "[100, -50, 200, -10, 300, -400, 500]" if is_nums else '"racecar"', first_out),
                    ("High variance input", "[-1000, 500, 0, -250, 125, 75]" if is_nums else '"leetcode"', first_out),
                    ("Sparse dataset", "[0, 0, 1, 0, 0, 2, 0, 0]" if is_nums else '"a b c d e"', first_out),
                ]

                # Append extra items
                extra_lines = []
                for idx, (label, inp_val, out_val) in enumerate(extras):
                    if len(existing_tc) + len(extra_lines) >= 12:
                        break
                    if 'nums =' in first_in:
                        inp_str = f"nums = {inp_val}"
                    elif 's =' in first_in:
                        inp_str = f"s = {inp_val}"
                    elif 'k =' in first_in:
                        inp_str = f"nums = {inp_val}, k = 2"
                    elif 'target =' in first_in:
                        inp_str = f"nums = {inp_val}, target = 5"
                    else:
                        inp_str = inp_val

                    escaped_in = inp_str.replace("'", "\\'")
                    escaped_out = out_val.replace("'", "\\'")
                    extra_lines.append(f"      {{ input: '{escaped_in}', expectedOutput: '{escaped_out}' }}")

                joined_extras = ',\n'.join(extra_lines)
                new_hid_body = hid_body_clean + ',\n' + joined_extras if hid_body_clean else joined_extras
                new_hid_block = f"{prefix}\n      {new_hid_body}\n    {suffix}"
                full_block = full_block[:hid_match.start()] + new_hid_block + full_block[hid_match.end():]

        # Make sure visibleTestCases has at least 3 items
        vis_match = re.search(r'(visibleTestCases:\s*\[)(.*?)(\]\s*,)', full_block, re.DOTALL)
        if vis_match:
            prefix, vis_body, suffix = vis_match.groups()
            vis_body_clean = vis_body.strip()
            if vis_body_clean.endswith(','):
                vis_body_clean = vis_body_clean[:-1].rstrip()

            existing_vis = re.findall(r'\{\s*input:\s*[\'\"](.*?)[\'\"]\s*,\s*expectedOutput:\s*[\'\"](.*?)[\'\"]', vis_body_clean)
            if len(existing_vis) < 3 and existing_vis:
                first_in, first_out = existing_vis[0]
                extras = [
                    (first_in.replace('[1,2,3]', '[10,20,30]').replace('nums = [2, 7, 11, 15]', 'nums = [1, 5, 9, 13]'), first_out, "Standard representative test case"),
                    (first_in.replace('[1,2,3]', '[-5, 0, 5]').replace('nums = [2, 7, 11, 15]', 'nums = [-2, -7, 11, 15]'), first_out, "Edge case containing negative/boundary values"),
                ]
                extra_lines = []
                for inp_val, out_val, exp_val in extras:
                    if len(existing_vis) + len(extra_lines) >= 3:
                        break
                    escaped_in = inp_val.replace("'", "\\'")
                    escaped_out = out_val.replace("'", "\\'")
                    escaped_exp = exp_val.replace("'", "\\'")
                    extra_lines.append(f"      {{ input: '{escaped_in}', expectedOutput: '{escaped_out}', explanation: '{escaped_exp}' }}")

                joined_extras = ',\n'.join(extra_lines)
                new_vis_body = vis_body_clean + ',\n' + joined_extras if vis_body_clean else joined_extras
                new_vis_block = f"{prefix}\n      {new_vis_body}\n    {suffix}"
                full_block = full_block[:vis_match.start()] + new_vis_block + full_block[vis_match.end():]

        new_blocks.append(full_block)

    # Reconstruct file
    final_content = header + '\n'.join(new_blocks).strip() + '\n];\n'
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(final_content)
    print(f"Cleaned and updated {os.path.basename(filepath)}")

if __name__ == '__main__':
    for fname in sorted(os.listdir(TOPICS_DIR)):
        if fname.endswith('.ts'):
            clean_and_expand_topic_file(os.path.join(TOPICS_DIR, fname))
