import os
import json

# Directory containing images
image_directory = "images"

# List all files in the directory
all_files = os.listdir(image_directory)

# Filter out non-image files (assuming jpg, png, and gif are your image formats)
image_files = [f for f in all_files if f.endswith(('.jpg', '.jpeg', '.png', '.gif'))]

# Write the list to manifest.json
with open(os.path.join(image_directory, 'manifest.json'), 'w') as f:
    json.dump({"images": image_files}, f, indent=4)

print("Manifest file created successfully!")