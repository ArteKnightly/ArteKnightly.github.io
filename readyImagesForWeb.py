import os
import json
import shutil
import uuid
from datetime import datetime
from generateManifest import generateManifest
from imageProcess import process_image
import random
import string

raw_directory = "raw"
completed_directory = os.path.join(raw_directory, "complete")
image_directory = "images"
manifest_path = os.path.join(image_directory, 'manifest.json')

# Ensure completed_directory exists
if not os.path.exists(completed_directory):
    os.makedirs(completed_directory)

# Load the existing manifest or create an empty one
if os.path.exists(manifest_path):
    with open(manifest_path, 'r') as f:
        manifest_data = json.load(f)
else:
    manifest_data = {"images": []}
# ...

# Process each image in the raw directory
for image_filename in os.listdir(raw_directory):
    if image_filename.endswith(('.jpg', '.jpeg')):
        input_path = os.path.join(raw_directory, image_filename)
        
        # Generate a 10-character alphanumeric UUID
        image_uuid = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
        
        # Process the image
        image_data = process_image(input_path, image_directory, image_uuid + '.jpg')
        
        # Update manifest
        manifest_data["images"].append({
            "UUID": image_uuid,
            "original_filename": image_filename,
            "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "ScoreColor": 0,
            "ScoreContent": 0,
            "ScoreCraft": 0
        })
        
        # Move the original image to completed
        shutil.move(input_path, os.path.join(completed_directory, image_filename))
# Save the updated manifest
with open(manifest_path, 'w') as f:
    json.dump(manifest_data, f, indent=4)

print("All images ready for the web!")
