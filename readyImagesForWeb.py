#ReadyImagesForWeb.py
import os
import json
import shutil
import uuid
from datetime import datetime
from imageProcess import process_image

raw_directory = "raw"
completed_directory = os.path.join(raw_directory, "complete")
image_directory = "images"
data_directory = "data"
manifest_path = os.path.join(data_directory, 'manifest.json')

# Ensure directories exist
if not os.path.exists(completed_directory):
    os.makedirs(completed_directory)
if not os.path.exists(data_directory):
    os.makedirs(data_directory)
if not os.path.exists(image_directory):
    os.makedirs(image_directory)

# Load the existing manifest or create an empty one
if os.path.exists(manifest_path):
    with open(manifest_path, 'r') as f:
        manifest_data = json.load(f)
else:
    manifest_data = {"images": []}

# Process each image in the raw directory
for image_filename in os.listdir(raw_directory):
    if image_filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        input_path = os.path.join(raw_directory, image_filename)
        
        # Generate a UUID (if 10-character alphanumeric is needed, this should be changed)
        UUIDImage = str(uuid.uuid4())  # This generates a standard UUID
        
        # Process the image and save as PNG
        image_data = process_image(input_path, image_directory, UUIDImage + '.png')
        
        # Update manifest
        manifest_data["images"].append({
            "UUIDImage": UUIDImage,
            "original_filename": image_filename,
            "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "ScoreColor": 0,
            "ScoreContent": 0,
            "ScoreCraft": 0
        })
        
        # Move the original image to completed_directory
        shutil.move(input_path, os.path.join(completed_directory, image_filename))

# Save the updated manifest
with open(manifest_path, 'w') as f:
    json.dump(manifest_data, f, indent=4)

print("All images ready for the web!")
