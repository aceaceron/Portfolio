import os

EXCLUDED_FOLDERS = {".git", ".next", ".vercel", ".vscode", "node_modules" }

def print_directory_tree(path, prefix=""):
    items = sorted(os.listdir(path))
    entries = [
        os.path.join(path, item)
        for item in items
        if item not in EXCLUDED_FOLDERS
    ]
    
    for i, entry in enumerate(entries):
        is_last = i == len(entries) - 1
        connector = "└── " if is_last else "├── "

        print(prefix + connector + os.path.basename(entry))

        if os.path.isdir(entry):
            new_prefix = prefix + ("    " if is_last else "│   ")
            print_directory_tree(entry, new_prefix)

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    print(os.path.basename(current_dir))
    print_directory_tree(current_dir)
