from PIL import Image
from Scale import scale_image
from Center import center_image
from Save import save_image

def process_image(input_path, output_directory, original_filename, target_width=800, target_height=600):
    img = Image.open(input_path)
    img = scale_image(img, target_width, target_height)
    img = center_image(img, target_width, target_height)
    image_data = save_image(img, output_directory, original_filename)
    return image_data  # Return the image data object for the image
