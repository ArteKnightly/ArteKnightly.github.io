#imageProcess.py
from PIL import Image
from Scale import scale_image
import os


def process_image(input_path, output_directory, original_filename):
    img = Image.open(input_path)
    img = scale_image(img, 1024)  # Scale the image to a maximum size of 1024 pixels

    # Save the processed image as PNG
    output_path = os.path.join(output_directory, original_filename)
    img.save(output_path, "PNG", quality=85)  # PNG doesn't use 'quality', but keep it for consistency

    return output_path