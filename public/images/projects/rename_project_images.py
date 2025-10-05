import os

# Folder containing your images
folder_path = r"C:\Users\Aceron\Documents\_PROJECTS\Website Portfolio\portfolio\public\images\projects\cn-feedback"

# Starting number
start_num = 2

# Get all files in the folder
files = sorted(os.listdir(folder_path))

# Filter only .png files (optional)
files = [f for f in files if f.lower().endswith(".png")]

# Rename files sequentially
for i, filename in enumerate(files, start=start_num):
    new_name = f"CNFeedback{i:02}.png"  # :02 ensures two-digit numbering
    old_path = os.path.join(folder_path, filename)
    new_path = os.path.join(folder_path, new_name)
    
    os.rename(old_path, new_path)
    print(f"Renamed {filename} -> {new_name}")

print("Renaming completed!")
