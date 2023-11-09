#Save.py
from datetime import datetime
import uuid
import os


def save_image(img, output_directory, original_filename):
    UUIDImage = str(uuid.uuid4())
    output_path = os.path.join(output_directory, UUIDImage + ".png")
    img.save(output_path, "PNG")  # No quality setting needed for PNG
    
    # Create the image data object
    image_data = {
        "UUIDImage": UUIDImage,
        "original_filename": original_filename,
        "currentdatetime": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "ScoreColor": 0,
        "ScoreContent": 0,
        "ScoreCraft": 0
    }

    return image_data
