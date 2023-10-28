from PIL import Image

def center_image(img, target_width, target_height):
    background = Image.new('RGB', (target_width, target_height), (255, 255, 255))
    offset = ((target_width - img.width) // 2, (target_height - img.height) // 2)
    background.paste(img, offset)
    return background
