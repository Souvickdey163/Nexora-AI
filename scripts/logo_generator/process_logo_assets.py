import os
from PIL import Image, ImageOps

image_path = "/Users/souvickdey/.gemini/antigravity-ide/brain/fc740931-a22f-42b9-9a37-bb0d56fec25d/.user_uploaded/media_1787570079952.png"

img = Image.open(image_path).convert("RGBA")
print(f"Original size: {img.size}")

# Process transparent background
# Convert white / near-white background to transparent (alpha = 0)
datas = img.getdata()
new_data = []

for item in datas:
    r, g, b, a = item
    # Threshold for white background
    if r > 240 and g > 240 and b > 240:
        new_data.append((255, 255, 255, 0))
    else:
        # Keep crisp alpha edges
        # If it's near white, anti-aliased edge
        if r > 200 and g > 200 and b > 200:
            avg = (r + g + b) // 3
            alpha = int((255 - avg) / 55.0 * 255)
            alpha = max(0, min(255, alpha))
            new_data.append((r, g, b, alpha))
        else:
            new_data.append((r, g, b, 255))

img_transparent = Image.new("RGBA", img.size)
img_transparent.putdata(new_data)

# Bounding box crop to trim unnecessary margin
bbox = img_transparent.getbbox()
print(f"BBox: {bbox}")

cropped = img_transparent.crop(bbox)

# Add small padding to make square aspect ratio
w, h = cropped.size
max_dim = max(w, h)
pad_w = (max_dim - w) // 2
pad_h = (max_dim - h) // 2

# Add 5% safety margin
margin = int(max_dim * 0.08)
new_size = max_dim + (margin * 2)

square_img = Image.new("RGBA", (new_size, new_size), (0, 0, 0, 0))
square_img.paste(cropped, (pad_w + margin, pad_h + margin))

# Resize to high resolution square formats (e.g. 512x512 and 1024x1024)
high_res_512 = square_img.resize((512, 512), Image.Resampling.LANCZOS)
high_res_1024 = square_img.resize((1024, 1024), Image.Resampling.LANCZOS)

# Create a light variant (where black is converted to white/light slate for dark mode)
datas_light = high_res_512.getdata()
new_data_light = []
for r, g, b, a in datas_light:
    if a > 0:
        # If pixel is dark/black (r, g, b < 60), turn to clean white/light color for dark backdrops
        if r < 80 and g < 80 and b < 80:
            new_data_light.append((240, 245, 250, a))
        else:
            new_data_light.append((r, g, b, a))
    else:
        new_data_light.append((0, 0, 0, 0))

light_variant_512 = Image.new("RGBA", (512, 512))
light_variant_512.putdata(new_data_light)

# Output paths
output_dir_root = "/Users/souvickdey/Nexora/public"
output_dir_frontend = "/Users/souvickdey/Nexora/frontend/public"

for target_dir in [output_dir_root, output_dir_frontend]:
    os.makedirs(target_dir, exist_ok=True)
    high_res_512.save(os.path.join(target_dir, "logo-nexora.png"), "PNG")
    high_res_512.save(os.path.join(target_dir, "logo-nexora-light.png"), "PNG")
    high_res_512.save(os.path.join(target_dir, "logo-transparent.png"), "PNG")
    high_res_512.save(os.path.join(target_dir, "logo.png"), "PNG")
    light_variant_512.save(os.path.join(target_dir, "logo-light.png"), "PNG")
    high_res_512.save(os.path.join(target_dir, "favicon.ico"), "ICO", sizes=[(32, 32), (48, 48), (64, 64)])

print("Successfully saved processed logo images to public directories!")
