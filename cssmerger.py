import os

def merge_css_files(directory):
    merged_css = ""
    used_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.css'):
                file_path = os.path.join(root, file)
                used_files.append(file_path)
                with open(file_path, 'r') as f:
                    content = f.read()
                    merged_css += f"/* {file_path} */\n" + content + "\n\n"
    print("Used files:", used_files)
    return merged_css

def write_merged_css(merged_css_content, output_file):
    with open(output_file, 'w') as f:
        f.write(merged_css_content)

# Example usage
directory = 'css'
output_file = 'merged.css'
merged_css_content = merge_css_files(directory)
write_merged_css(merged_css_content, output_file)
