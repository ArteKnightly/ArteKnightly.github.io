from generateManifest import generateManifest
from imageProcess import process_image
import os
import json
import shutil

raw_directory = "raw"
completed_directory = os.path.join(raw_directory, "complete")
image_directory = "images"
manifest_path = os.path.join(image_directory, 'manifest.json')

# Generate or update the manifest
all_images = generateManifest(raw_directory)

# If manifest exists, retrieve the existing data
if os.path.exists(manifest_path):
    with open(manifest_path, 'r') as f:
        image_data_list = json.load(f).get("images", [])
else:
    image_data_list = []

# Process unprocessed images
for image in all_images:
    # Check if the image is already processed using the original filename
    if not any(data["original_filename"] == image for data in image_data_list):
        input_path = os.path.join(raw_directory, image)
        image_data = process_image(input_path, image_directory, image)  # The process_image now returns the image data
        image_data_list.append(image_data)
        shutil.move(input_path, os.path.join(completed_directory, image))  # Move the raw image to \raw\complete

# Update the manifest with image data
with open(manifest_path, 'w') as f:
    json.dump({"images": image_data_list}, f, indent=4)

print("All images ready for the web!")
