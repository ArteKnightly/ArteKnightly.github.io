from datetime import datetime
import uuid
import os


def save_image(img, output_directory, original_filename):
    unique_id = str(uuid.uuid4())[:10]  # Generates a unique 10-digit identifier
    output_path = os.path.join(output_directory, unique_id + ".jpg")
    img.save(output_path, "JPEG", quality=90)
    
    # Create the image data object
    image_data = {
        "UUID": unique_id,
        "original_filename": original_filename,
        "currentdatetime": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "ScoreColor": 0,
        "ScoreContent": 0,
        "ScoreCraft": 0
    }

    return image_data
