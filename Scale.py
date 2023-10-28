from PIL import Image

def scale_image(input_image, max_size):
    original_width, original_height = input_image.size
    aspect_ratio = original_width / original_height

    if original_width > original_height:
        # Landscape orientation
        new_width = max_size
        new_height = int(new_width / aspect_ratio)
    else:
        # Portrait orientation
        new_height = max_sizemn 
        new_width = int(new_height * aspect_ratio)

    scaled_image = input_image.resize((new_width, new_height), Image.LANCZOS)
    return scaled_image
