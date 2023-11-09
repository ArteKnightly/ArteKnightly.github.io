#Center.py
from PIL import Image

def center_image(img, target_width, target_height):
    """
    Center the image and crop it to the target size.
    """
    img_width, img_height = img.size

    # Calculate the cropping box
    left = (img_width - target_width) / 2
    top = (img_height - target_height) / 2
    right = (img_width + target_width) / 2
    bottom = (img_height + target_height) / 2

    return img.crop((left, top, right, bottom))
