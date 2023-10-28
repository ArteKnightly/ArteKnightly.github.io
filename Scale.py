from PIL import Image

def scale_image(img, target_width, target_height):
    scale_factor = min(target_width / img.width, target_height / img.height)
    new_width = int(img.width * scale_factor)
    new_height = int(img.height * scale_factor)
    return img.resize((new_width, new_height), Image.LANCZOS)
